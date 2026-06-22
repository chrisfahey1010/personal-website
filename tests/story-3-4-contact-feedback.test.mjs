import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.mjs';

test('contact feedback is limited to browser-native validation and mail client handoff', () => {
  const contact = read('src/pages/contact.astro');
  const css = read('src/styles/global.css');

  assert.match(contact, /required type="text"/);
  assert.match(contact, /textarea[^>]+required/);
  assert.match(contact, /form\.reportValidity\(\)/);
  assert.match(css, /\.contact-field/);
  assert.match(css, /\.contact-input/);
  assert.match(css, /\.contact-textarea/);
  assert.doesNotMatch(contact, /status|success|error|loading/i);
});
