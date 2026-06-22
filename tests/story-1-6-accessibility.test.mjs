import test from 'node:test';
import assert from 'node:assert/strict';
import { build, publicPageFiles, read } from './helpers.mjs';

test('core pages preserve accessibility basics', () => {
  const base = read('src/layouts/BaseLayout.astro');
  const css = read('src/styles/global.css');

  assert.match(base, /skip-link/);
  assert.match(base, /href="#main-content"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test('built pages expose landmarks and current nav state', () => {
  build();
  for (const file of publicPageFiles) {
    const html = read(file);
    assert.match(html, /<main\b[^>]*id="main-content"/);
    assert.match(html, /<nav\b/);
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  }
});
