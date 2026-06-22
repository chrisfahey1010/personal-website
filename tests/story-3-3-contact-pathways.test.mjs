import test from 'node:test';
import assert from 'node:assert/strict';
import { build, read, stripHead } from './helpers.mjs';

test('contact page is a static mailto composer', () => {
  const contact = read('src/pages/contact.astro');
  const config = read('src/config/contact.ts');

  assert.match(config, /chrisfahey1010@gmail\.com/);
  assert.match(contact, /<form class="contact-form" id="contact-form">/);
  assert.match(contact, /id="contact-subject"/);
  assert.match(contact, /id="contact-message"/);
  assert.match(contact, /Open email draft/);
  assert.match(contact, /mailto:/);
  assert.match(contact, /window\.location\.href/);
  assert.match(contact, /<noscript>/);
  assert.doesNotMatch(contact, /Formspree|Netlify|fetch\(/i);
});

test('built contact page exposes one simple composer and fallback address', () => {
  build();
  const body = stripHead(read('dist/contact/index.html'));

  assert.match(body, /<h1[^>]*>Contact<\/h1>/);
  assert.match(body, /name="subject"/);
  assert.match(body, /name="message"/);
  assert.match(body, /Open email draft/);
  assert.match(body, /chrisfahey1010@gmail\.com/);
  assert.doesNotMatch(body, /What happens next|What helps most|Review the resume again|Back to projects/);
});
