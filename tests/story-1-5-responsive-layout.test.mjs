import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));
const readDistCss = () => {
  const astroDir = path.join(root, 'dist/_astro');
  const cssFiles = fs.readdirSync(astroDir).filter((file) => file.endsWith('.css'));

  return cssFiles.map((file) => fs.readFileSync(path.join(astroDir, file), 'utf8')).join('\n');
};

test('story 1.5 task 1: shared styles define a mobile-to-desktop layout contract with a tuned tablet range', () => {
  const globalStyles = read('src/styles/global.css');

  assert.match(globalStyles, /--page-max-width:/, 'shared page width should be centralized in css variables');
  assert.match(globalStyles, /--page-gutter:/, 'shared page gutter should be centralized in css variables');
  assert.match(globalStyles, /--section-space:/, 'shared section spacing should be centralized in css variables');
  assert.match(globalStyles, /@media \(min-width: 48rem\) and \(max-width: 63\.999rem\)/, 'tablet-specific responsive tuning should be explicit');
  assert.match(globalStyles, /@media \(max-width: 47\.999rem\)/, 'mobile range should stop before the tablet breakpoint begins');
  assert.match(globalStyles, /\.home-page\s*\{[\s\S]*width:\s*min\(100% - var\(--page-gutter\), var\(--page-max-width\)\)/, 'home page width should use the shared gutter contract');
  assert.match(globalStyles, /\.route-page\s*\{[\s\S]*width:\s*min\(100% - var\(--page-gutter\), var\(--page-max-width\)\)/, 'route pages should use the shared gutter contract');
  assert.match(globalStyles, /\.proof-shell\s*\{[\s\S]*max-width:\s*var\(--content-max-width\)/, 'proof shell should stay on the shared readable content width');
  assert.doesNotMatch(globalStyles, /overflow-x:\s*(clip|hidden);/, 'shared layout should prevent horizontal overflow instead of masking it globally');
});

test('story 1.5 task 2: homepage hero keeps identity and next-step cues readable across breakpoints', () => {
  const heroSection = read('src/components/sections/HeroSection.astro');
  const globalStyles = read('src/styles/global.css');

  assert.match(heroSection, /<div class="hero-copy">[\s\S]*<div class="hero-actions">[\s\S]*<a class="hero-cta"/, 'hero copy should group the primary CTA inside a dedicated action block');
  assert.match(heroSection, /<div class="hero-actions">[\s\S]*<ul class="trust-tags"/, 'trust tags should stay near the CTA and identity copy');
  assert.match(heroSection, /<div class="hero-signal-media">[\s\S]*(hero-portrait|hero-monogram)/, 'hero signal should give media its own responsive wrapper');
  assert.match(globalStyles, /\.hero-actions\s*\{/, 'hero actions should have explicit responsive styling');
  assert.match(globalStyles, /\.hero-signal-media\s*\{/, 'hero media wrapper should have explicit responsive styling');
  assert.match(globalStyles, /@media \(max-width: 47\.999rem\)[\s\S]*\.hero-signal\s*\{[\s\S]*order:\s*initial;/, 'mobile hero flow should stop forcing the signal card ahead of identity copy');
});

test('story 1.5 task 3: shared navigation keeps touch targets and current-page state stable across breakpoints', () => {
  const siteNav = read('src/components/navigation/SiteNav.astro');
  const globalStyles = read('src/styles/global.css');

  assert.match(siteNav, /<li class="site-nav-item">/, 'nav items should expose a dedicated hook for responsive layout control');
  assert.match(globalStyles, /\.site-nav-item\s*\{/, 'nav items should have explicit shared styling');
  assert.match(globalStyles, /@media \(min-width: 48rem\) and \(max-width: 63\.999rem\)[\s\S]*\.site-nav-list\s*\{[\s\S]*grid-template-columns:/, 'tablet navigation should have tuned grid behavior');
  assert.match(globalStyles, /@media \(max-width: 47\.999rem\)[\s\S]*\.site-nav-current-marker\s*\{[\s\S]*display:\s*none;/, 'mobile navigation should avoid crowding labels with the current-page badge');
});

test('story 1.5 task 4: typography, media, and interactive affordances scale without fixed-screen assumptions', () => {
  const globalStyles = read('src/styles/global.css');

  assert.match(globalStyles, /\.site-identity-mark\s*\{[\s\S]*font-size:\s*clamp\(/, 'site identity mark should scale fluidly');
  assert.match(globalStyles, /\.site-identity-copy\s*\{[\s\S]*font-size:\s*clamp\(/, 'site identity copy should scale fluidly');
  assert.match(globalStyles, /\.route-intro\s*\{[\s\S]*font-size:\s*clamp\(/, 'route intros should use fluid typography');
  assert.match(globalStyles, /\.hero-signal-media\s*\{[\s\S]*width:\s*min\(100%,/, 'hero media wrapper should keep portrait treatment bounded and responsive');
  assert.match(globalStyles, /\.site-nav-link:(?:hover|focus-visible),\s*\n\.site-nav-link:(?:hover|focus-visible)|\.site-nav-link:is\(:hover, :focus-visible\)/, 'navigation affordances should not rely on hover alone');
  assert.match(globalStyles, /\.hero-cta:(?:hover|focus-visible),\s*\n\.hero-cta:(?:hover|focus-visible)|\.hero-cta:is\(:hover, :focus-visible\)/, 'primary CTA affordances should not rely on hover alone');
});

test('story 1.5 task 5: regression coverage guards responsive shells and built primary pages', () => {
  const homeContent = read('src/content/pages/home.md');
  const baseLayout = read('src/layouts/BaseLayout.astro');
  const globalStyles = read('src/styles/global.css');

  assert.match(baseLayout, /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/, 'viewport meta should preserve a mobile-first baseline');
  assert.match(globalStyles, /\.hero-copy\s*\{[\s\S]*min-width:\s*0;/, 'hero copy should guard against grid overflow');
  assert.match(globalStyles, /\.site-header-nav\s*\{[\s\S]*min-width:\s*0;/, 'shared navigation container should guard against overflow');
  assert.match(homeContent, /primaryCtaHref:\s*"\/projects\/"/, 'homepage content should keep the primary CTA aligned to the projects route');

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const builtCss = readDistCss();

  const builtPages = [
    'dist/index.html',
    'dist/projects/index.html',
    'dist/resume/index.html',
    'dist/contact/index.html',
  ];

  for (const filePath of builtPages) {
    assert.equal(exists(filePath), true, `${filePath} should exist in build output`);

    const html = read(filePath);
    const h1Matches = html.match(/<h1\b[^>]*>/g) ?? [];
    const navMatches = html.match(/<nav[^>]*aria-label="Primary"/g) ?? [];

    assert.equal(h1Matches.length, 1, `${filePath} should keep a single page-level h1`);
    assert.equal(navMatches.length, 1, `${filePath} should keep a single primary nav landmark`);
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/, `${filePath} should preserve the shared viewport meta`);
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${filePath} should remain static-first`);
  }

  const homeHtml = read('dist/index.html');

  assert.match(homeHtml, /<section class="proof-section" id="proof"/, 'homepage build should preserve the CTA anchor target');
  assert.equal((homeHtml.match(/<nav[^>]*aria-label="Primary"/g) ?? []).length, 1, 'homepage build should not duplicate primary nav markup across breakpoints');
  assert.doesNotMatch(builtCss, /overflow-x:(clip|hidden)/, 'compiled styles should not globally hide horizontal overflow');
  assert.match(builtCss, /\.hero-copy\{[^}]*min-width:0/, 'compiled styles should keep hero copy from overflowing its grid track');
  assert.match(builtCss, /\.site-header-nav\{[^}]*min-width:0/, 'compiled styles should keep the shared nav container shrink-safe');
  assert.match(builtCss, /\.hero-signal-media\{[^}]*width:min\(100%,18rem\)/, 'compiled styles should keep hero media bounded on narrow screens');
  assert.match(builtCss, /@media\(max-width:47\.999rem\)\{[\s\S]*?\.trust-tags li\{(?=[^}]*width:100%)(?=[^}]*justify-content:center)/, 'compiled mobile styles should stack trust tags without overflow-prone wrapping');
  assert.match(builtCss, /@media\(max-width:47\.999rem\)\{[\s\S]*?\.hero-cta\{[^}]*width:100%/, 'compiled mobile styles should let the primary CTA fill the narrow layout instead of forcing a fixed inline width');
});
