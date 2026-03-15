import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));
const projectsDir = path.join(root, 'src/content/projects');

const getProjectContentFiles = () => {
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  return fs
    .readdirSync(projectsDir)
    .filter((entry) => entry.endsWith('.md'))
    .sort();
};

test('story 2.1 task 1: canonical projects content model exists', () => {
  const contentConfig = read('src/content/config.ts');

  assert.match(contentConfig, /const projects = defineCollection\(/, 'projects collection should be defined in the content config');
  assert.match(contentConfig, /title:\s*nonEmptyString/, 'project schema should require title');
  assert.match(contentConfig, /summary:\s*nonEmptyString/, 'project schema should require summary');
  assert.match(contentConfig, /context:\s*nonEmptyString/, 'project schema should require context');
  assert.match(contentConfig, /relevanceCues:\s*z\.array\(nonEmptyString\)\.min\(1\)/, 'project schema should require at least one relevance cue');
  assert.match(contentConfig, /seoTitle:\s*nonEmptyString/, 'project schema should require seoTitle');
  assert.match(contentConfig, /seoDescription:\s*nonEmptyString/, 'project schema should require seoDescription');
  assert.match(contentConfig, /export const collections = \{[\s\S]*projects/m, 'projects collection should be exported for Astro content loading');
});

test('story 2.1 task 1: canonical projects content and helper exist', () => {
  assert.equal(exists('src/lib/content/get-projects.ts'), true, 'projects helper should exist in the canonical lib/content location');

  const helperSource = read('src/lib/content/get-projects.ts');
  assert.match(helperSource, /from 'astro:content'/, 'projects helper should load from Astro content collections');
  assert.match(helperSource, /getCollection\('projects'\)/, 'projects helper should read the canonical projects collection');
  assert.match(helperSource, /slug/, 'projects helper should normalize stable slugs for routing');

  const projectFiles = getProjectContentFiles();
  assert.ok(projectFiles.length >= 2, 'at least two authored project entries should exist for quick comparison');

  for (const fileName of projectFiles) {
    const source = read(`src/content/projects/${fileName}`);

    assert.match(source, /^---[\s\S]*title:/m, `${fileName} should define a title`);
    assert.match(source, /^---[\s\S]*summary:/m, `${fileName} should define a summary`);
    assert.match(source, /^---[\s\S]*context:/m, `${fileName} should define a context`);
    assert.match(source, /^---[\s\S]*relevanceCues:/m, `${fileName} should define relevance cues`);
    assert.match(source, /^---[\s\S]*seoTitle:/m, `${fileName} should define seoTitle`);
    assert.match(source, /^---[\s\S]*seoDescription:/m, `${fileName} should define seoDescription`);
    assert.match(source, /^---[\s\S]*slug:/m, `${fileName} should define a stable slug in frontmatter`);
  }
});

test('story 2.1 task 2 and 3: route source stays thin and links to static detail pages', () => {
  const indexSource = read('src/pages/projects/index.astro');
  const listComponentSource = read('src/components/projects/ProjectIndexList.astro');
  const helperSource = read('src/lib/content/get-projects.ts');

  assert.match(indexSource, /getProjects/, 'projects index should consume the canonical projects helper');
  assert.match(indexSource, /ProjectIndexList/, 'projects index should stay thin and delegate rendering to a shared component');
  assert.match(listComponentSource, /<ol|<ul/, 'projects list component should render a semantic list for scanning');
  assert.match(listComponentSource, /<article/, 'projects list component should render each project inside an article');
  assert.match(listComponentSource, /href=\{project\.preview\.href\}/, 'projects list component should render explicit links to project detail pages');
  assert.match(listComponentSource, /project\.preview\.ctaLabel/, 'project links should expose project-specific labels');
  assert.match(helperSource, /Duplicate project slug detected/, 'projects helper should guard against duplicate slugs');

  assert.equal(exists('src/pages/projects/[slug].astro'), true, 'project detail route should exist');

  const detailSource = read('src/pages/projects/[slug].astro');
  assert.match(detailSource, /getStaticPaths/, 'detail route should generate static paths');
  assert.match(detailSource, /getProjects/, 'detail route should use the canonical projects helper');
  assert.match(detailSource, /Astro\.params\.slug/, 'detail route should resolve pages by route slug');
  assert.doesNotMatch(detailSource, /client:load|client:idle|client:visible|client:only/, 'detail route should stay static-first for core browsing');
});

test('story 2.1 task 4 and 5: build output preserves scannable structure and static detail navigation', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  assert.equal(exists('dist/projects/index.html'), true, 'projects index should exist in the production build');

  const indexHtml = read('dist/projects/index.html');
  const detailFiles = getProjectContentFiles().map((fileName) => `dist/projects/${fileName.replace(/\.md$/, '')}/index.html`);
  const h1Matches = indexHtml.match(/<h1\b[^>]*>/g) ?? [];

  assert.equal(h1Matches.length, 1, 'projects index should expose exactly one h1');
  assert.match(indexHtml, /<meta name="description" content="[^"]+"/, 'projects index should emit page-level metadata');
  assert.match(indexHtml, /<link rel="canonical" href="[^"]+"/, 'projects index should emit a canonical link');
  assert.match(indexHtml, /<title>[^<]+<\/title>/, 'projects index should emit a page title');
  assert.match(indexHtml, /<ul[^>]*>|<ol[^>]*>/, 'projects index should preserve semantic list markup');
  assert.match(indexHtml, /<article\b/, 'projects index should preserve semantic article markup');
  assert.match(indexHtml, /Projects/, 'projects index should preserve clear project framing');
  assert.match(indexHtml, /Review [^<]+ proof/, 'projects index should preserve project-specific link labels');
  assert.doesNotMatch(indexHtml, /client:load|client:idle|client:visible|client:only/, 'projects index should not require hydration for browsing');

  for (const filePath of detailFiles) {
    assert.equal(exists(filePath), true, `${filePath} should exist in the production build`);

    const html = read(filePath);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${filePath} should emit metadata`);
    assert.match(html, /<link rel="canonical" href="[^"]+"/, `${filePath} should emit a canonical link`);
    assert.match(html, /<title>[^<]+<\/title>/, `${filePath} should emit a page title`);
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${filePath} should stay static-first`);
  }
});
