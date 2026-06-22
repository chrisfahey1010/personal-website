import test from 'node:test';
import assert from 'node:assert/strict';
import { bannedPublicCopy, build, countH1, read, runCheck, stripHead } from './helpers.mjs';

test('homepage content model is concise and CTA-driven', () => {
  const config = read('src/content/config.ts');
  const home = read('src/content/pages/home.md');
  const helper = read('src/lib/content/get-home-page.ts');
  const renderer = read('src/components/sections/HeroSection.astro');

  assert.match(config, /heroName/);
  assert.match(config, /heroRole/);
  assert.match(config, /heroIntro/);
  assert.match(config, /secondaryCtaLabel/);
  assert.doesNotMatch(config, /heroCredibilityBullets|trustTags|heroSignalCopy|journeyTitle/);
  assert.match(home, /^heroName:\s+Chris Fahey$/m);
  assert.match(home, /^heroRole:\s+Software engineer/m);
  assert.match(home, /^primaryCtaLabel:\s+Review projects$/m);
  assert.match(home, /^secondaryCtaLabel:\s+View resume$/m);
  assert.doesNotMatch(home, bannedPublicCopy);
  assert.doesNotMatch(helper, /journeyNextStep/);
  assert.doesNotMatch(renderer, /hero-signal-copy|trust-tags|hero-credibility-list/);
});

test('homepage builds as a short professional landing page', () => {
  runCheck();
  build();
  const html = read('dist/index.html');
  const body = stripHead(html);

  assert.equal(countH1(html), 1);
  assert.match(html, /<title>Chris Fahey \| Software Engineer<\/title>/);
  assert.match(body, /Chris Fahey/);
  assert.match(body, /Software engineer/);
  assert.match(body, /Review projects/);
  assert.match(body, /href="\/projects\/"/);
  assert.match(body, /View resume/);
  assert.match(body, /href="\/resume\/"/);
  assert.doesNotMatch(body, bannedPublicCopy);
});
