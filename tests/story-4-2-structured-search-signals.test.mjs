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
      'A portfolio rebuild focused on recruiter clarity, static delivery, and credible project presentation.',
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
  assert.match(postsIndexSource, /futureSeamStatus\.map\(\(item\) => <li>{item}<\/li>\)/, 'the posts archive should render the shared dormant seam policy when no posts are published');
  assert.doesNotMatch(navigationSource, /Posts|Writing|Blog/, 'launch navigation should stay limited to the MVP routes');
  assert.equal(exists('dist/posts/index.html'), true, 'future publishing may reserve a direct route seam without becoming launch navigation');
  assert.equal(exists('dist/posts/future-writing-seam/index.html'), false, 'draft placeholder content should not publish a post detail page');
});

test('story 4.5 task 2: future content seams stay schema-first and map external systems into the existing domain model', () => {
  const futureSeamsSource = read('src/config/future-seams.ts');
  const contentConfigSource = read('src/content/config.ts');
  const postsHelperSource = read('src/lib/content/get-posts.ts');
  const postsIndexSource = read('src/pages/posts/index.astro');
  const placeholderPost = read('src/content/posts/future-writing-seam.md');

  assert.match(futureSeamsSource, /canonicalAuthoredContentRoot/, 'future seam policy should keep authored content rooted in src/content');
  assert.match(futureSeamsSource, /contentSchemaBoundary/, 'future seam policy should codify the schema boundary');
  assert.match(futureSeamsSource, /contentNormalizationLayer/, 'future seam policy should codify the normalization layer');
  assert.match(futureSeamsSource, /futureIntegrationAdapterDirectory/, 'future seam policy should point future integrations at an explicit adapter seam');
  assert.match(futureSeamsSource, /futureApiDirectory/, 'future seam policy should point future dynamic endpoints at an explicit API seam');
  assert.match(futureSeamsSource, /cmsMappingRequirement/, 'future seam policy should require CMS mapping into the existing domain model');
  assert.match(futureSeamsSource, /isReservedFutureContentArea/, 'future seam policy should expose a reusable guard for reserved content surfaces');
  assert.match(contentConfigSource, /const posts = defineCollection\(/, 'content schemas should remain the canonical source boundary');
  assert.match(postsHelperSource, /getCollection\('posts'/, 'future posts should continue to flow through the shared normalization layer');
  assert.match(postsIndexSource, /futureSeamStatus\.map\(\(item\) => <li>{item}<\/li>\)/, 'posts route should render the shared future seam policy without route-local copy drift');
  assert.match(placeholderPost, /launch trust path/i, 'placeholder post should explain why the seam stays outside launch navigation');
});
