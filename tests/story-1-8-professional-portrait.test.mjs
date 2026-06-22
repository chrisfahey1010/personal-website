import test from 'node:test';
import assert from 'node:assert/strict';
import { build, exists, read } from './helpers.mjs';

test('professional portrait remains optional and bounded to public image assets', () => {
  const config = read('src/content/config.ts');
  const home = read('src/content/pages/home.md');
  const renderer = read('src/components/sections/HeroSection.astro');

  assert.match(config, /portraitSrc/);
  assert.match(config, /portraitAlt/);
  assert.match(config, /\/images\//);
  assert.match(home, /portraitSrc: "\/images\/profile\/chris-fahey-portrait\.jpg"/);
  assert.match(home, /portraitAlt:/);
  assert.match(renderer, /hero-portrait/);
  assert.match(renderer, /hero-monogram/);
});

test('homepage build uses the portrait if the asset is present', () => {
  build();
  const html = read('dist/index.html');

  assert.equal(exists('public/images/profile/chris-fahey-portrait.jpg'), true);
  assert.match(html, /src="\/images\/profile\/chris-fahey-portrait\.jpg"/);
  assert.match(html, /alt="Chris Fahey smiling outdoors/);
});
