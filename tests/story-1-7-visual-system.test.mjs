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

test('story 1.7 task 1: global styles define a richer editorial token and shell system', () => {
  const globalStyles = read('src/styles/global.css');

  assert.match(globalStyles, /--color-canvas:/, 'shared styles should define an editorial canvas token');
  assert.match(globalStyles, /--color-surface-raised:/, 'shared styles should define a raised surface token');
  assert.match(globalStyles, /--space-section-tight:/, 'shared styles should define a tighter editorial spacing token');
  assert.match(globalStyles, /--motion-reveal-duration:/, 'shared styles should define a shared motion timing token');
  assert.match(globalStyles, /--font-display:/, 'shared styles should define an editorial display font token');
  assert.match(globalStyles, /--content-measure:/, 'shared styles should define a shared readable measure token');
  assert.match(globalStyles, /\.route-shell-accent\s*\{/, 'route shells should expose a shared accent block');
  assert.match(globalStyles, /\.route-meta\s*\{/, 'route shells should expose shared metadata styling');
  assert.match(globalStyles, /\.editorial-reveal\s*\{/, 'shared styles should expose a restrained reveal treatment');
  assert.match(globalStyles, /h1\s*\{[\s\S]*font-family:\s*var\(--font-display\)/, 'hero headings should use the display typography token');
  assert.match(globalStyles, /\.route-lede\s*\{[\s\S]*color:\s*var\(--color-ink\)/, 'route ledes should visibly separate editorial emphasis from supporting copy');
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.editorial-reveal\s*\{[\s\S]*animation:\s*none;/, 'reveal motion should disable cleanly for reduced-motion users');
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.hero-cta\s*\{[\s\S]*transition:\s*none;/, 'interactive polish should disable cleanly for reduced-motion users');
  assert.match(globalStyles, /\.hero-cta:is\(:hover, :focus-visible\)\s*\{[\s\S]*transform:\s*translateY\(-1px\)/, 'motion polish should stay restrained to small emphasis shifts instead of moving controls dramatically');
});

test('story 1.7 task 2: homepage hero source adds stronger trust context without changing the content contract', () => {
  const heroSection = read('src/components/sections/HeroSection.astro');
  const contentConfig = read('src/content/config.ts');

  assert.match(heroSection, /<div class="hero-context">/, 'hero should group trust-building context in a dedicated wrapper');
  assert.match(heroSection, /<ul class="hero-credibility-list"/, 'hero should expose concise credibility cues in dedicated markup');
  assert.match(heroSection, /<p class="hero-signal-kicker">/, 'hero signal panel should add an editorial kicker for first-impression framing');
  assert.match(heroSection, /portraitSrc && portraitAlt/, 'hero should continue relying on the paired portrait content contract');
  assert.match(contentConfig, /portraitSrc and portraitAlt must be provided together/, 'portrait validation should remain in the content schema');
});

test('story 1.7 task 3: launch routes share the authored shell instead of generic single-paragraph intros', () => {
  const routeFiles = [
    'src/pages/projects/index.astro',
    'src/pages/resume.astro',
    'src/pages/contact.astro',
  ];

  for (const routeFile of routeFiles) {
    const routeSource = read(routeFile);

    assert.match(routeSource, /route-shell-accent/, `${routeFile} should include the shared editorial accent block`);
    assert.match(routeSource, /route-meta/, `${routeFile} should include shared route metadata cues`);
    assert.match(routeSource, /route-lede/, `${routeFile} should promote its route intro into a stronger lede treatment`);
    assert.match(routeSource, /editorial-reveal/, `${routeFile} should opt into the restrained shared reveal treatment`);
  }
});

test('story 1.7 task 4: build output preserves shared trust cues and cross-route visual hooks', () => {
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

    assert.match(html, /class="[^"]*editorial-reveal/, `${filePath} should keep the shared editorial reveal hook in output`);
  }

  const homeHtml = read('dist/index.html');

  assert.match(homeHtml, /hero-context/, 'homepage build should preserve the hero trust-context wrapper');
  assert.match(homeHtml, /hero-credibility-list/, 'homepage build should preserve concise credibility cues');
  assert.match(homeHtml, /Professional signal/, 'homepage build should preserve professional trust framing');
  assert.match(builtCss, /\.route-shell-accent\{/, 'compiled styles should preserve the shared route accent treatment');
  assert.match(builtCss, /\.route-meta\{/, 'compiled styles should preserve shared route metadata styling');
  assert.match(builtCss, /\.editorial-reveal\{[^}]*animation:/, 'compiled styles should preserve the restrained reveal motion');
});
