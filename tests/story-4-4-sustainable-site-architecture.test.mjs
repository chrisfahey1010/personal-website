import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };

const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

const launchPages = [
  'dist/index.html',
  'dist/projects/index.html',
  'dist/projects/portfolio-refresh/index.html',
  'dist/projects/team-dashboard-modernization/index.html',
  'dist/resume/index.html',
  'dist/contact/index.html',
];

test('story 4.4 task 1 and 2: source boundaries keep the launch experience static-first and optional integrations removable', () => {
  const packageJson = JSON.parse(read('package.json'));
  const navigationSource = read('src/config/navigation.ts');
  const baseLayoutSource = read('src/layouts/BaseLayout.astro');
  const homeRoute = read('src/pages/index.astro');
  const projectsRoute = read('src/pages/projects/index.astro');
  const resumeRoute = read('src/pages/resume.astro');
  const contactRoute = read('src/pages/contact.astro');
  const projectDetail = read('src/components/projects/ProjectDetailPage.astro');

  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), ['@tailwindcss/vite', 'astro', 'tailwindcss', 'zod'], 'launch dependencies should stay minimal and repo-controlled');
  assert.match(navigationSource, /label: 'Home' \| 'Projects' \| 'Resume' \| 'Contact'/, 'core navigation contract should stay narrow');
  assert.match(navigationSource, /href: '\/' \| '\/projects\/' \| '\/resume\/' \| '\/contact\/'/, 'core navigation contract should stay route-thin and explicit');
  assert.match(homeRoute, /await getHomePage\(\)/, 'homepage should continue loading repo-owned content through the shared helper');
  assert.match(projectsRoute, /await getProjects\(\)/, 'projects index should continue loading repo-owned content through the shared helper');
  assert.match(resumeRoute, /await getResumePageContent\(\)/, 'resume page should continue loading repo-owned content through the shared helper');
  assert.match(contactRoute, /primaryContactHref/, 'contact page should keep the direct mailto baseline');
  assert.match(projectDetail, /Optional references/, 'project detail pages should frame external artifacts as optional evidence');
  assert.match(projectDetail, /not for basic understanding/i, 'external artifacts should stay explicitly non-core');
  assert.doesNotMatch(baseLayoutSource, /<script\s+[^>]*src=|googletagmanager|google-analytics|plausible|segment|mixpanel|calendly|typeform|formspree/i, 'global layout must not add third-party scripts or widgets to the core shell');
  assert.doesNotMatch([homeRoute, projectsRoute, resumeRoute, contactRoute].join('\n'), /fetch\(|XMLHttpRequest|client:load|client:idle|client:visible|client:only/, 'launch routes should stay static-first and avoid runtime data or hydration requirements');
});

test('story 4.4 task 3: deployment notes and config stay aligned with the Cloudflare static baseline', () => {
  const astroConfig = read('astro.config.mjs');
  const wranglerConfig = read('wrangler.jsonc');
  const envExample = read('.env.example');
  const infraReadme = read('infrastructure/README.md');
  const cloudflareReadme = read('infrastructure/cloudflare/README.md');

  assert.match(astroConfig, /output:\s*'static'/, 'Astro should remain configured for static output');
  assert.match(wranglerConfig, /"directory":\s*"\.\/dist"/, 'Wrangler fallback should keep dist as the deploy artifact');
  assert.match(envExample, /Cloudflare|deployment credentials|GitHub/i, '.env.example should reflect the current deployment ownership model');
  assert.doesNotMatch(envExample, /AWS/i, '.env.example should not preserve stale AWS deployment guidance');
  assert.match(infraReadme, /Cloudflare Pages/i, 'infrastructure README should identify Cloudflare Pages as the primary host');
  assert.match(infraReadme, /Wrangler/i, 'infrastructure README should mention the committed Wrangler fallback');
  assert.match(infraReadme, /dist\//i, 'infrastructure README should identify dist as the static deploy artifact');
  assert.doesNotMatch(infraReadme, /AWS|S3|CloudFront|Route 53/i, 'infrastructure README should not drift back to AWS-first guidance');
  assert.match(cloudflareReadme, /npm run check/, 'Cloudflare deployment note should keep type validation in the release gate');
  assert.match(cloudflareReadme, /npm test/, 'Cloudflare deployment note should keep regression tests in the release gate');
  assert.match(cloudflareReadme, /npm run build/, 'Cloudflare deployment note should keep static build verification in the release gate');
});

test('story 4.4 task 4: built launch routes stay crawlable without optional third-party behavior', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  for (const page of launchPages) {
    assert.equal(exists(page), true, `${page} should exist in the static build output`);

    const html = read(page);

    assert.match(html, /href="\/"/, `${page} should link to the homepage`);
    assert.match(html, /href="\/projects\/"/, `${page} should keep the projects route crawlable`);
    assert.match(html, /href="\/resume\/"/, `${page} should keep the resume route crawlable`);
    assert.match(html, /href="\/contact\/"/, `${page} should keep the contact route crawlable`);
    assert.doesNotMatch(html, /<script\s+[^>]*src=|googletagmanager|google-analytics|plausible|segment|mixpanel|calendly|typeform|formspree/i, `${page} should not require third-party scripts or widgets`);
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${page} should not rely on hydration directives in the shipped HTML`);
  }
});
