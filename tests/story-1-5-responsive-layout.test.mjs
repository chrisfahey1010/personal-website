import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.mjs';

test('responsive CSS keeps the simplified pages usable on mobile', () => {
  const css = read('src/styles/global.css');

  assert.match(css, /@media \(max-width: 47\.999rem\)/);
  assert.match(css, /\.hero-section[^{}]*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /\.project-card-horizontal[^{}]*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /\.site-nav-list[^{}]*\{[\s\S]*grid-template-columns: repeat\(2/);
  assert.match(css, /\.contact-input/);
  assert.match(css, /\.contact-textarea/);
});
