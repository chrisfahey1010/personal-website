import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));
const hexToRgb = (hex) => {
  const normalized = hex.trim().replace('#', '');

  return [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16) / 255);
};

const toLuminance = ([red, green, blue]) => {
  const adjust = (value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

  const [r, g, b] = [red, green, blue].map(adjust);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = toLuminance(hexToRgb(foreground));
  const backgroundLuminance = toLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

const extractToken = (styles, tokenName) => {
  const match = styles.match(new RegExp(`${tokenName}:\\s*(#[0-9a-fA-F]{6})`));

  assert.ok(match, `${tokenName} should be defined as a hex token`);

  return match[1];
};

const readDistCss = () => {
  const astroDir = path.join(root, 'dist/_astro');
  const cssFiles = fs.readdirSync(astroDir).filter((file) => file.endsWith('.css'));

  return cssFiles.map((file) => fs.readFileSync(path.join(astroDir, file), 'utf8')).join('\n');
};

test('story 1.6 task 1: shared shell adds a skip link and stable main target for primary routes', () => {
  const baseLayout = read('src/layouts/BaseLayout.astro');
  const routeFiles = [
    'src/pages/index.astro',
    'src/pages/projects/index.astro',
    'src/pages/resume.astro',
    'src/pages/contact.astro',
  ];

  assert.match(baseLayout, /href="#main-content"/, 'shared shell should expose a skip link to the page main landmark');
  assert.match(baseLayout, /class="skip-link"/, 'shared shell should provide a dedicated skip-link hook');

  for (const routeFile of routeFiles) {
    const routeSource = read(routeFile);

    assert.match(routeSource, /<main[^>]*id="main-content"/, `${routeFile} should expose the stable skip-link target`);
  }
});

test('story 1.6 task 2: shared styling strengthens focus visibility, current-state cues, and reduced-motion handling', () => {
  const globalStyles = read('src/styles/global.css');

  assert.match(globalStyles, /--scroll-target-offset:/, 'anchor jumps should use a shared offset token');
  assert.match(globalStyles, /--color-focus:/, 'focus color should be tokenized for consistent contrast');
  assert.match(globalStyles, /\.skip-link\s*\{[\s\S]*position:\s*fixed;/, 'skip link should stay visible above sticky chrome when focused');
  assert.match(globalStyles, /:focus-visible\s*\{[\s\S]*outline:\s*3px solid var\(--color-focus\)/, 'keyboard focus should use a dedicated high-contrast outline');
  assert.match(globalStyles, /#main-content\s*\{[\s\S]*scroll-margin-top:\s*var\(--scroll-target-offset\)/, 'main landmark jumps should account for sticky header height');
  assert.match(globalStyles, /\.proof-section\s*\{[\s\S]*scroll-margin-top:\s*var\(--scroll-target-offset\)/, 'same-page proof anchor jumps should account for sticky header height');
  assert.match(globalStyles, /\.site-nav-link\.is-current\s*\{[\s\S]*text-decoration:\s*underline/, 'current nav state should keep a non-color cue');
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*scroll-behavior:\s*auto;/, 'reduced motion should disable smooth scrolling');
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration:\s*0\.01ms !important;/, 'reduced motion should neutralize decorative animation timing globally');
});

test('story 1.6 task 2: launch color tokens preserve minimum accessibility contrast targets', () => {
  const globalStyles = read('src/styles/global.css');
  const surface = extractToken(globalStyles, '--color-surface');
  const ink = extractToken(globalStyles, '--color-ink');
  const muted = extractToken(globalStyles, '--color-muted');
  const accent = extractToken(globalStyles, '--color-accent');
  const focus = extractToken(globalStyles, '--color-focus');

  assert.ok(contrastRatio(ink, surface) >= 4.5, 'body text color should meet AA contrast on the primary surface');
  assert.ok(contrastRatio(muted, surface) >= 4.5, 'supporting text color should meet AA contrast on the primary surface');
  assert.ok(contrastRatio(accent, surface) >= 4.5, 'accent text used for labels should meet AA contrast on the primary surface');
  assert.ok(contrastRatio(focus, surface) >= 3, 'focus indicator color should meet non-text contrast on the primary surface');
});

test('story 1.6 task 3: shared semantics stay native-first and preserve descriptive labels', () => {
  const siteHeader = read('src/components/navigation/SiteHeader.astro');
  const siteNav = read('src/components/navigation/SiteNav.astro');
  const heroSection = read('src/components/sections/HeroSection.astro');
  const contentConfig = read('src/content/config.ts');

  assert.match(siteHeader, /<nav aria-label="Primary"/, 'primary navigation landmark should remain explicitly labeled');
  assert.match(siteNav, /aria-current=\{isCurrent \? 'page' : undefined\}/, 'current page state should stay tied to aria-current');
  assert.match(siteNav, /site-nav-current-marker/, 'current page text cue should remain available in markup');
  assert.match(heroSection, /<aside class="hero-signal" aria-label="Professional signal">/, 'hero proof panel should keep a descriptive landmark label');
  assert.match(contentConfig, /portraitSrc and portraitAlt must be provided together/, 'portrait accessibility constraints should remain in the content schema');
});

test('story 1.6 task 4: build output preserves skip navigation, landmarks, headings, and accessible labels', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const builtCss = readDistCss();
  const builtPages = [
    ['dist/index.html', true],
    ['dist/projects/index.html', false],
    ['dist/resume/index.html', false],
    ['dist/contact/index.html', false],
  ];

  for (const [filePath, hasProofAnchor] of builtPages) {
    assert.equal(exists(filePath), true, `${filePath} should exist in build output`);

    const html = read(filePath);
    const h1Matches = html.match(/<h1\b[^>]*>/g) ?? [];
    const mainMatches = html.match(/<main\b[^>]*id="main-content"/g) ?? [];
    const currentMatches = html.match(/aria-current="page"/g) ?? [];

    assert.equal(h1Matches.length, 1, `${filePath} should keep exactly one h1`);
    assert.equal(mainMatches.length, 1, `${filePath} should keep exactly one main landmark with the shared target id`);
    assert.equal(currentMatches.length, 1, `${filePath} should keep exactly one current nav item`);
    assert.match(html, /href="#main-content"/, `${filePath} should render the skip link in built output`);
    assert.match(html, /<nav[^>]*aria-label="Primary"/, `${filePath} should keep the primary nav landmark`);

    if (hasProofAnchor) {
      assert.match(html, /id="proof"/, 'homepage build should preserve the proof-section anchor');
    }
  }

  assert.match(builtCss, /\.skip-link\{[^}]*position:fixed/, 'compiled styles should preserve the skip-link positioning contract');
  assert.match(builtCss, /#main-content\{[^}]*scroll-margin-top:var\(--scroll-target-offset\)/, 'compiled styles should preserve sticky-header-aware main jumps');
  assert.match(builtCss, /\.proof-section\{[^}]*scroll-margin-top:var\(--scroll-target-offset\)/, 'compiled styles should preserve sticky-header-aware proof jumps');
  assert.match(builtCss, /\.site-nav-link\.is-current\{[^}]*text-decoration:underline/, 'compiled styles should preserve non-color nav current-state cues');
  assert.match(builtCss, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*animation-duration:.01ms!important/, 'compiled styles should preserve reduced-motion global timing overrides');
});
