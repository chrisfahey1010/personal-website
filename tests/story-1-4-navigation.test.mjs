import test from 'node:test';
import assert from 'node:assert/strict';
import { build, publicPageFiles, read } from './helpers.mjs';

const navLabels = ['Home', 'Projects', 'Resume', 'Contact'];
const navHrefs = ['/', '/projects/', '/resume/', '/contact/'];

test('navigation config exposes the four public routes only', () => {
  const navigation = read('src/config/navigation.ts');

  for (const label of navLabels) assert.match(navigation, new RegExp(`label: '${label}'`));
  for (const href of navHrefs) assert.match(navigation, new RegExp(`href: '${href.replace(/\//g, '\\/')}'`));
  assert.doesNotMatch(navigation, /posts|project detail/i);
});

test('built pages keep global navigation visible', () => {
  build();
  for (const file of publicPageFiles) {
    const html = read(file);
    for (const label of navLabels) assert.match(html, new RegExp(`>${label}<`), `${file} should include ${label}`);
  }
});
