import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));
const buildEnv = { ...process.env, NODE_OPTIONS: '' };

test('story 2.4 task 1 and 2: project schema and helper expose optional storytelling extension seams', () => {
  const contentConfig = read('src/content/config.ts');
  const helperSource = read('src/lib/content/get-projects.ts');

  assert.match(contentConfig, /storyModules:\s*z(?:\s|\n)*\.array\(/, 'project schema should support optional story modules');
  assert.match(contentConfig, /z\.discriminatedUnion\('type'/, 'story modules should use a typed discriminated union');
  assert.match(contentConfig, /fs\.existsSync/, 'media items should verify the referenced static asset exists');
  assert.match(contentConfig, /width:\s*z\.number\(\)\.int\(\)\.positive\(\)/, 'media items should require explicit width metadata');
  assert.match(contentConfig, /height:\s*z\.number\(\)\.int\(\)\.positive\(\)/, 'media items should require explicit height metadata');
  assert.match(contentConfig, /reservedNarrativeSectionIds/, 'story modules should guard reserved built-in narrative ids');
  assert.match(contentConfig, /must be unique within a project/, 'story modules should reject duplicate ids');
  assert.match(helperSource, /export (?:type|interface) ProjectStoryModule/, 'project helper should expose a normalized story module interface');
  assert.match(helperSource, /storyModules:\s*ProjectStoryModule\[]/, 'project detail contract should include story modules');
  assert.match(helperSource, /\.{3}createNarrativeExtensions\(entry\)/, 'core narrative sections should absorb optional narrative extensions');
  assert.match(helperSource, /paragraphs:\s*Array\.isArray\(module\.content\) \? module\.content : \[module\.content\]/, 'narrative modules should normalize to multi-paragraph content');
});

test('story 2.4 task 2: detail component no longer depends on a fixed three-section narrative shape', () => {
  const detailComponentSource = read('src/components/projects/ProjectDetailPage.astro');

  assert.doesNotMatch(detailComponentSource, /slice\(0,\s*2\)/, 'detail component should not slice narrative sections to force a fixed shape');
  assert.doesNotMatch(detailComponentSource, /narrativeSections\[2\]/, 'detail component should not hardcode the third narrative section');
  assert.match(detailComponentSource, /storyModules\.filter\(/, 'detail component should render optional normalized story modules');
  assert.match(detailComponentSource, /section\.paragraphs\.map\(/, 'detail component should render multi-paragraph narrative sections');
});

test('story 2.4 task 3 and 4: build output supports richer optional storytelling without placeholder clutter', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  assert.equal(
    exists('dist/projects/portfolio-refresh/index.html'),
    true,
    'portfolio project detail page should exist in the production build',
  );
  assert.equal(
    exists('dist/images/projects/portfolio-refresh-proof-map.svg'),
    true,
    'optional project media should build from the reserved static asset boundary',
  );

  const portfolioHtml = read('dist/projects/portfolio-refresh/index.html');
  const dashboardHtml = read('dist/projects/team-dashboard-modernization/index.html');

  assert.match(portfolioHtml, /Implementation timeline/i, 'portfolio page should render optional narrative extensions when authored');
  assert.match(portfolioHtml, /Project structure snapshot/i, 'portfolio page should render optional media modules when authored');
  assert.match(
    portfolioHtml,
    /<img[^>]+src="\/images\/projects\/portfolio-refresh-proof-map\.svg"[^>]+alt="Annotated project map showing how the portfolio routes connect summary, supporting detail, and next steps\."[^>]+width="960"[^>]+height="640"/i,
    'portfolio page should render static project media from the reserved asset boundary',
  );
  assert.doesNotMatch(dashboardHtml, /Implementation timeline/i, 'projects without optional modules should not render narrative placeholders');
  assert.doesNotMatch(dashboardHtml, /Project structure snapshot/i, 'projects without optional modules should not render media placeholders');
  assert.doesNotMatch(portfolioHtml, /coming soon/i, 'optional storytelling seams should not introduce placeholder copy');
});
