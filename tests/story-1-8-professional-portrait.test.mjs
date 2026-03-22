import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const homeContentPath = path.join(root, 'src/content/pages/home.md');
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

const withTemporaryHomeContent = (replacement, assertion) => {
  const original = fs.readFileSync(homeContentPath, 'utf8');

  fs.writeFileSync(homeContentPath, replacement, 'utf8');

  try {
    assertion();
  } finally {
    fs.writeFileSync(homeContentPath, original, 'utf8');
  }
};

test('story 1.8 task 1: homepage content defines one canonical portrait asset and alt source', () => {
  const contentConfig = read('src/content/config.ts');
  const homeContent = read('src/content/pages/home.md');

  assert.equal(exists('public/images/profile/chris-fahey-portrait.jpg'), true, 'approved portrait asset should exist in the public image boundary');
  assert.match(contentConfig, /value\.startsWith\('\/images\/'\)/, 'portrait src should stay inside the public image boundary');
  assert.match(homeContent, /^portraitSrc:\s+"?\/images\/profile\/chris-fahey-portrait\.jpg"?$/m, 'homepage content should point to the canonical portrait asset');
  assert.match(homeContent, /^portraitAlt:\s+.+$/m, 'homepage content should provide descriptive alt text for the portrait');
});

test('story 1.8 tasks 2-3: homepage build renders the approved portrait with responsive accessible markup', () => {
  const indexSource = read('src/pages/index.astro');
  const homeHelperSource = read('src/lib/content/get-home-page.ts');
  const globalCss = read('src/styles/global.css');

  assert.match(homeHelperSource, /resolvePortrait\(entry\.data\.portraitSrc, entry\.data\.portraitAlt\)/, 'homepage helper should derive portrait props from the canonical content fields');
  assert.match(homeHelperSource, /portraitSrc:\s*portrait\.portraitSrc/, 'homepage helper should pass the resolved portrait src into the normalized hero contract');
  assert.match(homeHelperSource, /portraitAlt:\s*portrait\.portraitAlt/, 'homepage helper should pass the resolved portrait alt text into the normalized hero contract');
  assert.match(homeHelperSource, /fs\.existsSync/, 'homepage helper should preserve the monogram fallback when the portrait asset is unavailable');
  assert.match(indexSource, /<HeroSection \{\.\.\.homePage\.hero\} \/>/, 'homepage route should pass the normalized hero contract directly into the hero section');
  assert.match(globalCss, /\.hero-portrait\s*\{[^}]*object-fit:\s*cover;/s, 'portrait styles should preserve cropping with object-fit cover');
  assert.match(globalCss, /@media \(max-width:\s*47\.999rem\)\s*\{[\s\S]*\.hero-section\s*\{[\s\S]*grid-template-columns:\s*1fr;/, 'mobile hero layout should collapse to one column');
  assert.match(globalCss, /@media \(max-width:\s*47\.999rem\)\s*\{[\s\S]*\.hero-signal-media\s*\{[\s\S]*justify-items:\s*center;/, 'mobile portrait treatment should stay centered');

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const builtIndex = read('dist/index.html');

  assert.match(builtIndex, /<img class="hero-portrait" src="\/images\/profile\/chris-fahey-portrait\.jpg" alt="[^"]+" width="320" height="400" loading="eager">/, 'homepage build should render the portrait with the expected static-first hero markup');
  assert.doesNotMatch(builtIndex, /<div class="hero-monogram"/, 'homepage build should not fall back to the monogram when the canonical portrait asset is available');
});

test('story 1.8 task 2: homepage falls back cleanly when the canonical portrait asset is unavailable', () => {
  const missingPortraitContent = read('src/content/pages/home.md').replace(
    '/images/profile/chris-fahey-portrait.jpg',
    '/images/profile/missing-portrait.jpg',
  );

  withTemporaryHomeContent(missingPortraitContent, () => {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

    const builtIndex = read('dist/index.html');

    assert.match(builtIndex, /<div class="hero-monogram" aria-hidden="true">CF<\/div>/, 'homepage should fall back to the monogram when the canonical portrait asset is unavailable');
    assert.doesNotMatch(builtIndex, /missing-portrait\.jpg/, 'homepage should not emit a broken portrait path when the asset is unavailable');
  });
});
