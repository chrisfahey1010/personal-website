import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

const extractHrefValues = (html) => Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1]);

test('story 1.4 task 1: launch navigation config centralizes primary destinations', () => {
  assert.equal(exists('src/config/navigation.ts'), true, 'launch navigation config should exist');

  const navigationConfig = read('src/config/navigation.ts');

  assert.match(navigationConfig, /Home/);
  assert.match(navigationConfig, /Projects/);
  assert.match(navigationConfig, /Resume/);
  assert.match(navigationConfig, /Contact/);
  assert.match(navigationConfig, /href:\s*'\/'/);
  assert.match(navigationConfig, /href:\s*'\/projects\/'/);
  assert.match(navigationConfig, /href:\s*'\/resume\/'/);
  assert.match(navigationConfig, /href:\s*'\/contact\/'/);
  assert.doesNotMatch(navigationConfig, /Writing|Blog|Posts/, 'future writing routes should stay out of launch navigation');
});

test('story 4.5 task 1: launch navigation stays canonical while future seams remain explicitly out of scope', () => {
  assert.equal(exists('src/config/future-seams.ts'), true, 'future seam policy should be codified in source control');

  const navigationConfig = read('src/config/navigation.ts');
  const futureSeamsConfig = read('src/config/future-seams.ts');

  assert.match(futureSeamsConfig, /from '\.\/navigation'/, 'future seam policy should derive launch navigation from the canonical navigation config');
  assert.match(futureSeamsConfig, /launchNavigationItems\.map\(\(item\) => item\.label\)/, 'future seam policy should reuse the canonical launch navigation items instead of duplicating labels');
  assert.match(futureSeamsConfig, /isLaunchNavigationLabel/, 'future seam policy should expose a reusable launch-label guard');
  assert.match(futureSeamsConfig, /reservedFutureContentAreas/, 'future seam policy should document reserved post-launch surfaces');
  assert.match(futureSeamsConfig, /Posts/, 'future seam policy should keep posts as a reserved future surface');
  assert.match(futureSeamsConfig, /isReservedFutureContentArea/, 'future seam policy should expose a reusable future-surface guard');
  assert.match(futureSeamsConfig, /launchScopeAreas/, 'future seam policy should codify the MVP scope boundary');
  assert.match(futureSeamsConfig, /deployment-ready foundations/i, 'future seam policy should keep deployment-ready foundations inside launch scope');
  assert.doesNotMatch(navigationConfig, /Writing|Blog|Posts/, 'reserved future surfaces must stay out of launch navigation');
});

test('story 1.4 task 1: homepage CTA route validation shares the navigation-aware route contract', () => {
  const contentConfig = read('src/content/config.ts');

  assert.match(contentConfig, /from '\.\.\/config\/navigation'/, 'content config should import the canonical route contract');
  assert.match(contentConfig, /isBuiltPageRoute/);
  assert.doesNotMatch(contentConfig, /new Set\(\['\/'\]\)/, 'built routes should not be hardcoded to homepage only');
});

test('story 1.4 task 2: shared navigation lives in the global app shell', () => {
  assert.equal(exists('src/components/navigation/SiteHeader.astro'), true, 'shared site header should exist');
  assert.equal(exists('src/components/navigation/SiteNav.astro'), true, 'shared site nav should exist');

  const baseLayout = read('src/layouts/BaseLayout.astro');
  const siteHeader = read('src/components/navigation/SiteHeader.astro');
  const siteNav = read('src/components/navigation/SiteNav.astro');

  assert.match(baseLayout, /import SiteHeader from '\.\.\/components\/navigation\/SiteHeader\.astro'/);
  assert.match(baseLayout, /Astro\.url\.pathname/, 'layout should derive current-page state from the server-rendered route context');
  assert.match(baseLayout, /<SiteHeader pathname=\{pathname\} \/>/, 'layout should render the shared header once for all routes');
  assert.match(siteHeader, /<header\b/);
  assert.match(siteHeader, /<nav\b/);
  assert.match(siteNav, /<ul\b/);
  assert.match(siteNav, /aria-current=\{isCurrent \? 'page' : undefined\}/, 'navigation should expose aria-current for the active page');
  assert.match(siteNav, /launchNavigationItems/, 'navigation should render from the canonical launch config');
});

test('story 1.4 task 3: bounded primary route shells exist for launch navigation', () => {
  const routeFiles = [
    'src/pages/projects/index.astro',
    'src/pages/resume.astro',
    'src/pages/contact.astro',
  ];

  for (const routeFile of routeFiles) {
    assert.equal(exists(routeFile), true, `${routeFile} should exist`);

    const routeSource = read(routeFile);

    assert.match(routeSource, /import BaseLayout from/, 'route shell should stay thin and share the base layout');
    assert.match(routeSource, /<h1/, 'route shell should provide a clear page heading');
    assert.match(routeSource, /<p/, 'route shell should provide orientation copy for first-time visitors');
  }
});

test('story 1.4 task 4: mobile navigation stays native and lightweight', () => {
  const siteHeader = read('src/components/navigation/SiteHeader.astro');
  const siteNav = read('src/components/navigation/SiteNav.astro');
  const globalStyles = read('src/styles/global.css');

  assert.match(siteHeader, /<nav\b[^>]*aria-label="Primary"/, 'mobile navigation should remain semantic and directly reachable');
  assert.doesNotMatch(siteHeader, /<details\b[^>]*\sopen(?:\s|>)/, 'mobile navigation should not ship an always-expanded disclosure');
  assert.match(globalStyles, /min-height:\s*44px/, 'nav controls should keep target sizes large enough on mobile');
  assert.match(globalStyles, /@media \(max-width: 47\.999rem\)/, 'mobile navigation should switch just below the 48rem tablet breakpoint to avoid overlap');
  assert.doesNotMatch(siteHeader, /client:load|client:idle|client:visible|client:only/, 'mobile nav should not hydrate the whole header');
  assert.doesNotMatch(siteNav, /onClick|addEventListener/, 'mobile nav should not rely on custom JS interception');
});

test('story 1.4 task 5: production build preserves shared navigation across primary routes', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const builtPages = [
    ['dist/index.html', '/'],
    ['dist/projects/index.html', '/projects/'],
    ['dist/resume/index.html', '/resume/'],
    ['dist/contact/index.html', '/contact/'],
  ];

  for (const [filePath, currentRoute] of builtPages) {
    assert.equal(exists(filePath), true, `${filePath} should exist in the production build`);

    const html = read(filePath);
    const h1Matches = html.match(/<h1\b[^>]*>/g) ?? [];
    const currentMatches = html.match(/aria-current="page"/g) ?? [];

    assert.match(html, /<header\b/, 'shared header should render in built output');
    assert.match(html, /<nav[^>]*aria-label="Primary"/, 'primary nav should be semantic in built output');
    assert.match(html, />Home</, 'Home link label should be visible');
    assert.match(html, />Projects</, 'Projects link label should be visible');
    assert.match(html, />Resume</, 'Resume link label should be visible');
    assert.match(html, />Contact</, 'Contact link label should be visible');
    assert.equal(h1Matches.length, 1, `${filePath} should expose exactly one h1`);
    assert.equal(currentMatches.length, 1, `${filePath} should expose exactly one current nav item`);
    assert.match(html, new RegExp(`href="${currentRoute}"[^>]*aria-current="page"|aria-current="page"[^>]*href="${currentRoute}"`), 'current page should map to the matching route');
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, 'shared nav should remain static-first in built output');

    const hrefValues = extractHrefValues(html);
    const internalHrefs = hrefValues.filter((href) => href.startsWith('/') && !href.startsWith('/_astro/'));
    const samePageAnchors = hrefValues.filter((href) => href.startsWith('#'));

    for (const href of internalHrefs) {
      const builtHtmlPath = href === '/' ? 'dist/index.html' : `dist${href}index.html`;
      const builtAssetPath = href === '/' ? 'dist/index.html' : `dist${href}`;
      const builtTargetPath = exists(builtAssetPath) ? builtAssetPath : builtHtmlPath;

      assert.equal(exists(builtTargetPath), true, `${filePath} should only link to built internal routes (${href})`);
    }

    for (const anchor of samePageAnchors) {
      const anchorId = anchor.slice(1);
      assert.match(html, new RegExp(`id="${anchorId}"`), `${filePath} should only link to real same-page anchors (${anchor})`);
    }
  }
});
