import test from 'node:test';
import assert from 'node:assert/strict';
import { build, exists, publicPageFiles, read } from './helpers.mjs';

test('architecture stays static-first and dependency-light', () => {
  const packageJson = read('package.json');
  const contact = read('src/pages/contact.astro');

  assert.match(packageJson, /"astro"/);
  assert.doesNotMatch(packageJson, /formspree|netlify|resend|nodemailer/i);
  assert.doesNotMatch(contact, /fetch\(|client:load|client:idle|client:visible|client:only/);
  assert.match(contact, /mailto:/);
});

test('build output only needs static assets for the four public pages', () => {
  build();
  for (const file of publicPageFiles) assert.equal(exists(file), true);
  assert.equal(exists('dist/projects/castaway/index.html'), false);
  assert.equal(exists('dist/resume/chris-resume.pdf'), true);
});
