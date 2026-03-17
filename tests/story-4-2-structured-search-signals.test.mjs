import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

test('story 4.2 task 1 and 4: shared discoverability stays centralized across metadata and content seams', () => {
  const metadataSource = read('src/lib/seo/get-page-metadata.ts');
  const siteMetadataSource = read('src/lib/seo/site-metadata.ts');
  const projectRouteSource = read('src/pages/projects/[slug].astro');
  const projectHelperSource = read('src/lib/content/get-projects.ts');
  const contentConfigSource = read('src/content/config.ts');
  const postsHelperSource = read('src/lib/content/get-posts.ts');
  const postsIndexSource = read('src/pages/posts/index.astro');
  const postDetailSource = read('src/pages/posts/[slug].astro');

  assert.match(metadataSource, /export interface DiscoverabilityInput/, 'shared SEO helpers should expose a normalized discoverability input contract');
  assert.match(metadataSource, /export const createMetadataFromDiscoverability = \(/, 'shared SEO helpers should convert discoverability contracts into page metadata');
  assert.match(siteMetadataSource, /DEFAULT_SOCIAL_IMAGE_PATH/, 'launch-page metadata should reuse the shared social image constant');
  assert.match(siteMetadataSource, /DEFAULT_SOCIAL_IMAGE_ALT/, 'launch-page metadata should reuse the shared social image alt text');
  assert.match(projectRouteSource, /const metadata = createMetadataFromDiscoverability\(project\.discoverability\)/, 'project detail route should reuse the shared metadata builder for project discoverability');
  assert.match(projectRouteSource, /<BaseLayout metadata=\{metadata\}/, 'project detail route should pass a shared metadata object into the layout');
  assert.match(projectHelperSource, /openGraphType:\s*'website'/, 'project discoverability should stay explicit about the shared metadata contract');
  assert.match(contentConfigSource, /const posts = defineCollection\(/, 'content config should reserve a posts collection seam for future publishing');
  assert.match(contentConfigSource, /seoTitle: nonEmptyString/, 'future posts should reuse the existing seoTitle field name');
  assert.match(contentConfigSource, /seoDescription: nonEmptyString/, 'future posts should reuse the existing seoDescription field name');
  assert.match(contentConfigSource, /draft: z\.boolean\(\)\.default\(false\)/, 'future posts should support hidden draft content so the seam stays validated without becoming a launch requirement');
  assert.match(postsHelperSource, /discoverability:\s*\{/, 'future posts helper should normalize a discoverability contract');
  assert.match(postsHelperSource, /canonicalPath: `\/posts\/\$\{slug\}\/`/, 'future posts helper should define canonical paths through the shared pattern');
  assert.match(postsIndexSource, /createPageMetadata\(/, 'posts index should use the shared metadata builder');
  assert.match(postDetailSource, /createMetadataFromDiscoverability\(post\.discoverability\)/, 'post detail route should reuse the shared discoverability-to-metadata helper');
});

test('story 4.2 task 2: project structured data stays server-rendered, truthful, and aligned to rendered content across project pages', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const projectPages = [
    [
      'dist/projects/portfolio-refresh/index.html',
      'Personal Website Refresh',
      'A portfolio rebuild focused on evaluator clarity, static delivery, and credible proof navigation.',
    ],
    [
      'dist/projects/team-dashboard-modernization/index.html',
      'Team Dashboard Modernization',
      'An internal dashboard modernization focused on clarity, workflow confidence, and operational decision support.',
    ],
  ];

  for (const [filePath, title, description] of projectPages) {
    const detailHtml = read(filePath);

    assert.match(detailHtml, new RegExp(`<h1>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`), 'project detail output should keep the visible heading aligned to the project title');
    assert.match(
      detailHtml,
      new RegExp(`<meta name="description" content="${description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
      'project detail output should keep the metadata description aligned to the authored discoverability description',
    );
    assert.match(detailHtml, /"@type":"CreativeWork"/, 'project detail structured data should add a truthful creative-work node for richer search signals');
    assert.match(detailHtml, /"author":\{"@type":"Person","name":"Chris Fahey"\}/, 'project detail structured data should identify the real author');
    assert.doesNotMatch(detailHtml, /client:load|client:idle|client:visible|client:only/, 'project discoverability should remain server-rendered and hydration-free');
  }

  const portfolioHtml = read('dist/projects/portfolio-refresh/index.html');
  assert.match(portfolioHtml, /"about":\[\{"@type":"Thing","name":"Static-first Astro architecture"\}/, 'project detail structured data should reflect real project relevance cues');
});

test('story 4.2 task 3 and 5: future publishing stays extension-ready without becoming a required launch path', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const navigationSource = read('src/config/navigation.ts');
  const postsIndexSource = read('src/pages/posts/index.astro');

  assert.equal(exists('src/content/posts/future-writing-seam.md'), true, 'the repository should keep a hidden draft entry so the posts seam stays validated in normal checks');
  assert.equal(exists('src/lib/content/get-posts.ts'), true, 'the repository should reserve a normalized future posts helper');
  assert.equal(exists('src/pages/posts/index.astro'), true, 'the repository should reserve a posts archive route seam');
  assert.equal(exists('src/pages/posts/[slug].astro'), true, 'the repository should reserve a post detail route seam');
  assert.match(postsIndexSource, /No published posts are live yet/, 'the posts archive should stay explicit about being dormant until real publishing begins');
  assert.doesNotMatch(navigationSource, /Posts|Writing|Blog/, 'launch navigation should stay limited to the MVP routes');
  assert.equal(exists('dist/posts/index.html'), true, 'future publishing may reserve a direct route seam without becoming launch navigation');
  assert.equal(exists('dist/posts/future-writing-seam/index.html'), false, 'draft placeholder content should not publish a post detail page');
});
