import test from 'node:test';
import assert from 'node:assert/strict';
import { build, read, stripHead } from './helpers.mjs';

test('guided evaluation path copy is removed in favor of normal navigation', () => {
  const home = read('src/pages/index.astro');
  const projects = read('src/pages/projects/index.astro');
  const resume = read('src/pages/resume.astro');
  const css = read('src/styles/global.css');

  assert.doesNotMatch(home, /JourneyNextStep|SocialProofSection/);
  assert.doesNotMatch(projects, /JourneyNextStep|route-meta/);
  assert.doesNotMatch(resume, /JourneyNextStep|project-detail-actions/);
  assert.doesNotMatch(css, /journey-next-step/);
});

test('built pages avoid next-step over-explanation', () => {
  build();
  for (const file of ['dist/index.html', 'dist/projects/index.html', 'dist/resume/index.html', 'dist/contact/index.html']) {
    const body = stripHead(read(file));
    assert.doesNotMatch(body, /next step|evaluation path|proof|formal experience/i, `${file} should avoid guided-evaluation language`);
  }
});
