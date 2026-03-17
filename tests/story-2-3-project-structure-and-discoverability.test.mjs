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

test('story 2.3 task 1: canonical project contract groups preview, detail, and discoverability data', () => {
  const contentConfig = read('src/content/config.ts');
  const helperSource = read('src/lib/content/get-projects.ts');

  assert.match(helperSource, /preview:\s*\{/, 'project helper should expose a preview contract');
  assert.match(helperSource, /detail:\s*\{/, 'project helper should expose a detail contract');
  assert.match(helperSource, /discoverability:\s*\{/, 'project helper should expose a discoverability contract');
  assert.match(helperSource, /canonicalPath:/, 'project discoverability contract should include a canonical path');
  assert.match(helperSource, /const slug = entry\.slug;/, 'project helper should use Astro\'s canonical collection slug as the stable route source');

  for (const fileName of getProjectContentFiles()) {
    const source = read(`src/content/projects/${fileName}`);

    assert.match(source, /^---[\s\S]*slug:/m, `${fileName} should define an explicit slug`);
    assert.match(source, /^---[\s\S]*summary:/m, `${fileName} should define preview summary copy`);
    assert.match(source, /^---[\s\S]*overview:/m, `${fileName} should define detail overview copy`);
    assert.match(source, /^---[\s\S]*seoTitle:/m, `${fileName} should define discoverability title metadata`);
    assert.match(source, /^---[\s\S]*seoDescription:/m, `${fileName} should define discoverability description metadata`);
  }
});

test('story 2.3 task 1: normalized helper keeps recurring project structure explicit', () => {
  const helperSource = read('src/lib/content/get-projects.ts');

  assert.match(helperSource, /createNarrativeSections/, 'project helper should centralize recurring narrative section shaping');
  assert.match(helperSource, /label: 'What this project is'/, 'project helper should expose the overview label');
  assert.match(helperSource, /label: 'Problem framing'/, 'project helper should expose the problem label');
  assert.match(helperSource, /label: 'Role and contribution'/, 'project helper should expose the role label');
  assert.match(helperSource, /const slug = entry\.slug;/, 'project helper should use the canonical collection slug generated from authored frontmatter');
  assert.doesNotMatch(helperSource, /entry\.data\.slug \?\? entry\.slug/, 'project helper should not fall back to generated slugs');
  assert.match(helperSource, /href: `\/projects\/\$\{slug\}\/`/, 'preview contract should expose the canonical detail href');
  assert.match(helperSource, /canonicalPath: `\/projects\/\$\{slug\}\/`/, 'discoverability contract should expose the canonical path');
  assert.match(helperSource, /ctaLabel: `Review \$\{entry\.data\.title\} proof`/, 'preview contract should expose a stable evaluator-facing CTA label');
});

test('story 2.3 task 2: shared project components use the same information hierarchy', () => {
  const indexComponentSource = read('src/components/projects/ProjectIndexList.astro');
  const detailComponentSource = read('src/components/projects/ProjectDetailPage.astro');

  assert.match(indexComponentSource, /ProjectStructureSummary/, 'project index should delegate recurring structure to a shared component');
  assert.match(detailComponentSource, /ProjectStructureSummary/, 'project detail should delegate recurring structure to a shared component');
  assert.match(indexComponentSource, /href=\{project\.preview\.href\}/, 'project index should consume the canonical preview href');
  assert.match(indexComponentSource, /project\.preview\.ctaLabel/, 'project index should consume the canonical preview CTA label');
  assert.match(indexComponentSource, /variant="preview"/, 'project index should render the preview hierarchy variant');
  assert.match(detailComponentSource, /variant="detail"/, 'project detail should render the detail hierarchy variant');
});

test('story 2.3 task 2: build output preserves recurring summary, context, proof framing, and next steps', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  assert.equal(exists('dist/projects/index.html'), true, 'projects index should exist in the build output');
  assert.equal(exists('dist/projects/portfolio-refresh/index.html'), true, 'project detail page should exist in the build output');

  const indexHtml = read('dist/projects/index.html');
  const detailHtml = read('dist/projects/portfolio-refresh/index.html');

  assert.match(indexHtml, /Summary/i, 'projects index should label the summary section explicitly');
  assert.match(indexHtml, /Context/i, 'projects index should label the context section explicitly');
  assert.match(indexHtml, /Why it matters/i, 'projects index should label relevance cues explicitly');
  assert.match(indexHtml, /Proof focus/i, 'projects index should expose proof framing explicitly');
  assert.match(indexHtml, /Next step/i, 'projects index should expose a dependable next step explicitly');

  assert.match(detailHtml, /Summary/i, 'project detail should preserve the same summary label');
  assert.match(detailHtml, /Context/i, 'project detail should preserve the same context label');
  assert.match(detailHtml, /Why it matters/i, 'project detail should preserve the same relevance label');
  assert.match(detailHtml, /Proof focus/i, 'project detail should preserve the same proof framing label');
  assert.match(detailHtml, /Next step/i, 'project detail should preserve the same next-step label');
});

test('story 2.3 task 3: discoverability stays centralized in shared site and layout boundaries', () => {
  const astroConfig = read('astro.config.mjs');
  const layoutSource = read('src/layouts/BaseLayout.astro');
  const detailRoute = read('src/pages/projects/[slug].astro');

  assert.match(astroConfig, /site:\s*'https:\/\/www\.fahey\.vip'/, 'Astro config should define the canonical production site');
  assert.match(layoutSource, /new URL\(canonicalPath, Astro\.site\)\.toString\(\)/, 'shared layout should generate canonical URLs from Astro.site');
  assert.match(detailRoute, /createMetadataFromDiscoverability\(project\.discoverability\)/, 'detail route should consume canonical paths from the normalized discoverability contract through the shared metadata helper');
  assert.match(detailRoute, /StructuredData/, 'detail route should delegate structured data rendering to a shared component');
});

test('story 2.3 task 3: build output emits absolute canonicals and truthful structured data', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const indexHtml = read('dist/projects/index.html');
  const detailHtml = read('dist/projects/portfolio-refresh/index.html');

  assert.match(indexHtml, /<link rel="canonical" href="https:\/\/www\.fahey\.vip\/projects\/"/, 'projects index should emit an absolute canonical URL');
  assert.match(detailHtml, /<link rel="canonical" href="https:\/\/www\.fahey\.vip\/projects\/portfolio-refresh\/"/, 'project detail should emit an absolute canonical URL');
  assert.match(detailHtml, /application\/ld\+json/, 'project detail should emit server-rendered JSON-LD');
  assert.match(detailHtml, /"@type":"WebPage"/, 'project detail structured data should describe the page as a WebPage');
  assert.match(detailHtml, /"@type":"BreadcrumbList"/, 'project detail structured data should include breadcrumbs');
  assert.match(detailHtml, /"name":"Personal Website Refresh"/, 'project detail structured data should use the real project title');
  assert.match(detailHtml, /"description":"A portfolio rebuild focused on evaluator clarity, static delivery, and credible proof navigation\."/, 'project detail structured data should use the real project description');
  assert.doesNotMatch(detailHtml, /<\/script><script/i, 'project detail structured data should escape script-closing sequences safely');
});

test('story 2.3 task 4 and 5: project routes stay static-first and reusable for future entries', () => {
  const indexRoute = read('src/pages/projects/index.astro');
  const detailRoute = read('src/pages/projects/[slug].astro');
  const indexComponentSource = read('src/components/projects/ProjectIndexList.astro');
  const detailComponentSource = read('src/components/projects/ProjectDetailPage.astro');
  const helperSource = read('src/lib/content/get-projects.ts');

  assert.doesNotMatch(indexRoute, /client:/, 'projects index route should not introduce client hydration');
  assert.doesNotMatch(detailRoute, /client:/, 'project detail route should not introduce client hydration');
  assert.match(indexRoute, /ProjectIndexList/, 'projects index route should continue delegating rendering to a shared component');
  assert.match(detailRoute, /ProjectDetailPage/, 'project detail route should continue delegating rendering to a shared component');
  assert.match(indexComponentSource, /ProjectStructureSummary/, 'projects index should keep recurring structure in a shared component');
  assert.match(detailComponentSource, /ProjectStructureSummary/, 'project detail should keep recurring structure in a shared component');
  assert.match(helperSource, /export interface ProjectPreview/, 'normalized helper should keep preview structure explicit for future entries');
  assert.match(helperSource, /export interface ProjectDetail/, 'normalized helper should keep detail structure explicit for future entries');
  assert.match(helperSource, /export interface ProjectDiscoverability/, 'normalized helper should keep discoverability structure explicit for future entries');
});

test('story 2.3 task 5: built project pages remain static and free of hydration markers', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const indexHtml = read('dist/projects/index.html');
  const detailHtml = read('dist/projects/portfolio-refresh/index.html');
  const secondDetailHtml = read('dist/projects/team-dashboard-modernization/index.html');

  assert.doesNotMatch(indexHtml, /client:/, 'projects index build output should not contain client hydration directives');
  assert.doesNotMatch(detailHtml, /client:/, 'project detail build output should not contain client hydration directives');
  assert.doesNotMatch(secondDetailHtml, /client:/, 'second project detail build output should not contain client hydration directives');
});
