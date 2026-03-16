import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const homeContentPath = path.join(root, 'src/content/pages/home.md');

const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

const runCheckFailure = () => {
  try {
    execFileSync('npm', ['run', 'check'], { cwd: root, stdio: 'pipe' });
    return '';
  } catch (error) {
    return String(error.stderr || error.stdout || error.message);
  }
};

const withTemporaryHomeContent = (replacement, assertion) => {
  const original = fs.readFileSync(homeContentPath, 'utf8');

  fs.writeFileSync(homeContentPath, replacement, 'utf8');

  try {
    assertion();
  } finally {
    fs.writeFileSync(homeContentPath, original, 'utf8');
  }
};

test('story 1.3 task 1: homepage content schema and authored entry define the hero contract', () => {
  const contentConfig = read('src/content/config.ts');
  const homeContent = read('src/content/pages/home.md');

  assert.match(contentConfig, /heroName/);
  assert.match(contentConfig, /heroRole/);
  assert.match(contentConfig, /heroIntro/);
  assert.match(contentConfig, /trustTags/);
  assert.match(contentConfig, /\.min\(1\)\.max\(4\)/, 'trust tags should stay bounded to a short list');
  assert.match(contentConfig, /primaryCtaLabel/);
  assert.match(contentConfig, /primaryCtaHref/);
  assert.match(contentConfig, /startsWith\('#'\)|value\.startsWith\('\/'\)/, 'CTA href should be limited to same-page anchors or built routes');
  assert.match(contentConfig, /portraitSrc/);
  assert.match(contentConfig, /portraitAlt/);
  assert.match(contentConfig, /superRefine|refine/, 'portrait fields should be validated together');

  assert.match(homeContent, /^title:\s+.+$/m);
  assert.match(homeContent, /^description:\s+.+$/m);
  assert.match(homeContent, /^heroName:\s+Chris Fahey$/m);
  assert.match(homeContent, /^heroRole:\s+Product-minded software engineer$/m);
  assert.match(homeContent, /^heroIntro:\s+.+$/m);
  assert.match(homeContent, /^primaryCtaLabel:\s+Review project proof$/m);
  assert.match(homeContent, /^primaryCtaHref:\s+"?\/projects\/"?$/m);
  assert.match(homeContent, /^trustTags:\s*$/m);
});

test('story 1.3 task 1: homepage schema rejects CTA routes that are not actually built', () => {
  const invalidHomeContent = read('src/content/pages/home.md').replace('/projects/', '/not-a-built-route');

  withTemporaryHomeContent(invalidHomeContent, () => {
    const failureOutput = runCheckFailure();

    assert.match(failureOutput, /CTA href must be a same-page anchor or an existing built route/);
  });
});

test('story 1.3 task 1: homepage schema rejects drifting portrait metadata', () => {
  const invalidHomeContent = read('src/content/pages/home.md').replace(
      'primaryCtaHref: "/projects/"',
      'primaryCtaHref: "/projects/"\nportraitSrc: /images/chris-portrait.jpg',
  );

  withTemporaryHomeContent(invalidHomeContent, () => {
    const failureOutput = runCheckFailure();

    assert.match(failureOutput, /portraitSrc and portraitAlt must be provided together/);
  });
});

test('story 1.3 tasks 2-4: production build renders an editorial hero with a real next step', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  assert.equal(exists('dist/index.html'), true, 'build should still generate the homepage');

  const builtIndex = read('dist/index.html');
  const h1Matches = builtIndex.match(/<h1\b[^>]*>/g) ?? [];

  assert.match(builtIndex, /<title>Chris Fahey \| Product-minded software engineer<\/title>/, 'homepage title should reflect the authored hero identity');
  assert.equal(h1Matches.length, 1, 'homepage should expose a single clear h1');
  assert.match(builtIndex, /<h1[^>]*>Chris Fahey<\/h1>/, 'hero should identify Chris by name');
  assert.match(builtIndex, /Product-minded software engineer/, 'hero should expose role or focus copy');
  assert.match(builtIndex, /I design and ship calm, credible web experiences that help teams explain complex work clearly\./, 'hero should include concise evaluator-friendly introduction copy');
  assert.match(builtIndex, /Available for senior IC and staff-level product engineering/, 'hero should include a visible trust-oriented cue');
  assert.match(builtIndex, /Review project proof/, 'hero should include a visible next-step label');
  assert.match(builtIndex, /href="\/projects\/"/, 'CTA should point to the projects route as the next evaluation step');
  assert.match(builtIndex, /Continue into project proof/, 'hero should explain why projects are the next stop in the evaluation journey');
  assert.match(builtIndex, /id="proof"/, 'homepage proof section should still exist in the rendered homepage');
  assert.match(builtIndex, /Selected proof points/, 'below-hero evaluative section should contribute real trust value');
  assert.doesNotMatch(builtIndex, /Baseline Astro foundation for upcoming story implementation\./, 'baseline placeholder copy should be removed');
  assert.doesNotMatch(builtIndex, /client:load|client:idle|client:visible|client:only/, 'hero implementation should remain static-first without broad hydration');
});
