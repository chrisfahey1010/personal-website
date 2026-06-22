import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.mjs';

test('visual system remains polished while using fewer content-heavy components', () => {
  const css = read('src/styles/global.css');

  assert.match(css, /--color-canvas/);
  assert.match(css, /--font-display/);
  assert.match(css, /--shadow-soft/);
  assert.match(css, /\.route-shell/);
  assert.match(css, /\.hero-cta-row/);
  assert.match(css, /\.project-status-badge/);
  assert.doesNotMatch(css, /hero-signal-copy|trust-tags|project-proof-card|project-story-module/);
});
