import test from 'node:test';
import assert from 'node:assert/strict';
import { bannedPublicCopy, build, read, stripHead } from './helpers.mjs';

test('resume and contact source copy is intentionally minimal', () => {
  const resume = read('src/content/resume/overview.md');
  const resumeRoute = read('src/pages/resume.astro');
  const contactRoute = read('src/pages/contact.astro');

  assert.match(resume, /Open or download my current resume as a PDF\./);
  assert.match(contactRoute, /Send me a note about a role, project, or consulting opportunity\./);
  assert.doesNotMatch(resumeRoute, /summary|highlight|review guidance/i);
  assert.doesNotMatch(contactRoute, /guidance-card|What to send|What helps most/i);
  assert.doesNotMatch(`${resume}\n${contactRoute}`, bannedPublicCopy);
});

test('built resume and contact pages avoid marketing-card sprawl', () => {
  build();
  const resume = stripHead(read('dist/resume/index.html'));
  const contact = stripHead(read('dist/contact/index.html'));

  assert.doesNotMatch(resume, /resume-summary|highlight|review guidance/i);
  assert.doesNotMatch(contact, /contact-guidance-card|What to send|What helps most/i);
  assert.doesNotMatch(`${resume}\n${contact}`, bannedPublicCopy);
});
