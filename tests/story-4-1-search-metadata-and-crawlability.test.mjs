import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

const launchPages = [
  ['dist/index.html', 'https://www.fahey.vip/'],
  ['dist/projects/index.html', 'https://www.fahey.vip/projects/'],
  ['dist/resume/index.html', 'https://www.fahey.vip/resume/'],
  ['dist/contact/index.html', 'https://www.fahey.vip/contact/'],
];

const projectDetailPages = [
  ['dist/projects/portfolio-refresh/index.html', 'https://www.fahey.vip/projects/portfolio-refresh/'],
  ['dist/projects/team-dashboard-modernization/index.html', 'https://www.fahey.vip/projects/team-dashboard-modernization/'],
];

test('story 4.1 task 1 and 2: shared layout emits consistent metadata for launch routes', () => {
  const layoutSource = read('src/layouts/BaseLayout.astro');

  assert.match(layoutSource, /<meta property="og:title" content=\{/, 'shared layout should emit Open Graph titles');
  assert.match(layoutSource, /<meta property="og:description" content=\{/, 'shared layout should emit Open Graph descriptions');
  assert.match(layoutSource, /<meta property="og:url" content=\{/, 'shared layout should emit canonical page URLs for sharing');
  assert.match(layoutSource, /<meta property="og:image" content=\{/, 'shared layout should emit a reusable Open Graph image');
  assert.match(layoutSource, /<meta name="twitter:card" content="summary" \/>/, 'shared layout should emit a baseline Twitter card');
  assert.match(layoutSource, /<meta name="twitter:image" content=\{/, 'shared layout should emit a reusable Twitter image');
  assert.match(layoutSource, /<link rel="canonical" href=\{canonicalHref\} \/>/, 'shared layout should continue emitting canonical links');
});

test('story 4.1 task 1 and 4: launch-page content and routes define truthful metadata inputs', () => {
  const homeContent = read('src/content/pages/home.md');
  const homeRoute = read('src/pages/index.astro');
  const homeHelper = read('src/lib/content/get-home-page.ts');
  const projectsRoute = read('src/pages/projects/index.astro');
  const resumeRoute = read('src/pages/resume.astro');
  const resumeHelper = read('src/lib/content/get-resume.ts');
  const contactRoute = read('src/pages/contact.astro');
  const sharedMetadata = read('src/lib/seo/site-metadata.ts');

  assert.match(homeContent, /^---[\s\S]*seoTitle:/m, 'home page content should define an explicit SEO title');
  assert.match(homeContent, /^---[\s\S]*seoDescription:/m, 'home page content should define an explicit SEO description');
  assert.match(homeRoute, /getHomePage/, 'home page should stay thin and delegate metadata shaping to a helper');
  assert.match(homeHelper, /canonicalPath:\s*'\/'/, 'home page helper should define the homepage canonical path');
  assert.match(sharedMetadata, /projects:\s*createPageMetadata\([\s\S]*canonicalPath:\s*'\/projects\/'/, 'shared metadata should define the projects canonical path');
  assert.match(sharedMetadata, /resume:\s*createPageMetadata\([\s\S]*canonicalPath:\s*'\/resume\/'/, 'shared metadata should define the resume canonical path');
  assert.match(sharedMetadata, /contact:\s*createPageMetadata\([\s\S]*canonicalPath:\s*'\/contact\/'/, 'shared metadata should define the contact canonical path');
  assert.match(projectsRoute, /launchPageMetadata\.projects/, 'projects index should use the shared metadata seam');
  assert.match(resumeRoute, /getResumePageContent/, 'resume page should reuse the shared metadata seam through the helper');
  assert.match(resumeHelper, /title:\s*content\.seoTitle/, 'resume helper should derive the resume metadata title from owner-authored content');
  assert.match(resumeHelper, /canonicalPath:\s*launchPageMetadata\.resume\.canonicalPath/, 'resume helper should reuse the shared canonical seam');
  assert.match(contactRoute, /launchPageMetadata\.contact/, 'contact page should use the shared metadata seam');
});

test('story 4.1 task 2 and 3: build output stays crawlable and emits launch-page metadata', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  for (const [filePath, canonicalUrl] of launchPages) {
    assert.equal(exists(filePath), true, `${filePath} should exist in the build output`);

    const html = read(filePath);

    assert.match(html, /<title>[^<]+<\/title>/, `${filePath} should emit a title tag`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${filePath} should emit a meta description`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${filePath} should emit an absolute canonical URL`);
     assert.match(html, /<meta property="og:title" content="[^"]+"/, `${filePath} should emit an Open Graph title`);
     assert.match(html, /<meta property="og:description" content="[^"]+"/, `${filePath} should emit an Open Graph description`);
     assert.match(html, /<meta property="og:type" content="website"/, `${filePath} should declare a website Open Graph type`);
     assert.match(html, new RegExp(`<meta property="og:url" content="${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${filePath} should emit a shareable canonical URL`);
     assert.match(html, /<meta property="og:image" content="https:\/\/www\.fahey\.vip\/images\/share\/site-preview\.svg"/, `${filePath} should emit the shared social preview image`);
     assert.match(html, /<meta name="twitter:card" content="summary"/, `${filePath} should emit a baseline Twitter card`);
     assert.match(html, /<meta name="twitter:image" content="https:\/\/www\.fahey\.vip\/images\/share\/site-preview\.svg"/, `${filePath} should emit the shared Twitter preview image`);
     assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${filePath} should not depend on hydration for discoverability`);
     assert.match(html, /<h1\b[^>]*>/, `${filePath} should expose primary page meaning in server-rendered HTML`);
     assert.match(html, /href="\/projects\/"/, `${filePath} should expose normal crawlable links to the projects route`);
     assert.match(html, /href="\/resume\/"|href="\/contact\/"|href="\/"/, `${filePath} should expose normal crawlable internal links`);
  }
});

test('story 4.1 task 1 and 5: project detail pages inherit the shared metadata contract', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  for (const [filePath, canonicalUrl] of projectDetailPages) {
    assert.equal(exists(filePath), true, `${filePath} should exist in the build output`);

    const html = read(filePath);

    assert.match(html, /<title>[^<]+<\/title>/, `${filePath} should emit a title tag`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${filePath} should emit a meta description`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${filePath} should emit an absolute canonical URL`);
    assert.match(html, /<meta property="og:title" content="[^"]+"/, `${filePath} should emit an Open Graph title`);
    assert.match(html, /<meta property="og:description" content="[^"]+"/, `${filePath} should emit an Open Graph description`);
    assert.match(html, new RegExp(`<meta property="og:url" content="${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${filePath} should emit a shareable canonical URL`);
    assert.match(html, /<meta property="og:image" content="https:\/\/www\.fahey\.vip\/images\/share\/site-preview\.svg"/, `${filePath} should emit the shared social preview image`);
    assert.match(html, /application\/ld\+json/, `${filePath} should keep server-rendered structured data`);
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${filePath} should not depend on hydration for discoverability`);
    assert.match(html, /href="\/projects\/"/, `${filePath} should preserve a normal link back to the projects index`);
  }
});

test('story 4.1 task 2: robots.txt exists as a simple repository-owned crawlability asset', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  assert.equal(exists('public/robots.txt'), true, 'robots.txt should exist in the public static asset boundary');
  assert.equal(exists('dist/robots.txt'), true, 'robots.txt should be copied into the production build');

  const robots = read('dist/robots.txt');

  assert.match(robots, /^User-agent:\s*\*/m, 'robots.txt should target general crawlers');
  assert.match(robots, /^Allow:\s*\/$/m, 'robots.txt should allow crawling of the public site');
});

test('story 4.1 task 2: shared social preview asset remains repository-owned and build-visible', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  assert.equal(exists('public/images/share/site-preview.svg'), true, 'the social preview asset should exist in the public asset boundary');
  assert.equal(exists('dist/images/share/site-preview.svg'), true, 'the social preview asset should be copied into the production build');
});
