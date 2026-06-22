import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.mjs';

test('future content seams do not leak into the simplified launch routes', () => {
  const routes = [
    read('src/pages/index.astro'),
    read('src/pages/projects/index.astro'),
    read('src/pages/resume.astro'),
    read('src/pages/contact.astro'),
  ].join('\n');

  assert.doesNotMatch(routes, /posts|blog|newsletter|case study/i);
  assert.throws(() => read('src/pages/posts/index.astro'), /ENOENT/, 'posts should not build as a public route in the rescue pass');
  assert.throws(() => read('src/pages/posts/[slug].astro'), /ENOENT/, 'post detail pages should not build as public routes in the rescue pass');
});
