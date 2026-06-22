import test from 'node:test';
import assert from 'node:assert/strict';
import { build, countH1, exists, publicPageFiles, read } from './helpers.mjs';

test('foundation keeps the static four-page launch surface', () => {
  assert.equal(exists('package.json'), true);
  assert.equal(exists('astro.config.mjs'), true);
  assert.equal(exists('src/pages/index.astro'), true);
  assert.equal(exists('src/pages/projects/index.astro'), true);
  assert.equal(exists('src/pages/resume.astro'), true);
  assert.equal(exists('src/pages/contact.astro'), true);
  assert.equal(exists('src/pages/projects/[slug].astro'), false, 'project detail routes are intentionally removed for this rescue pass');

  const packageJson = read('package.json');
  assert.match(packageJson, /"test"/);
  assert.match(packageJson, /"check"/);
  assert.match(packageJson, /"build"/);
});

test('production build emits one h1 per public page', () => {
  build();

  for (const file of publicPageFiles) {
    assert.equal(exists(file), true, `${file} should exist`);
    assert.equal(countH1(read(file)), 1, `${file} should expose one h1`);
  }
});
