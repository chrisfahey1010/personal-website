import test from 'node:test';
import assert from 'node:assert/strict';
import { bannedPublicCopy, build, publicPageFiles, read, stripHead } from './helpers.mjs';

const sourceSurfaces = [
  'src/content/pages/home.md',
  'src/pages/projects/index.astro',
  'src/content/resume/overview.md',
  'src/pages/contact.astro',
  'src/components/sections/HeroSection.astro',
  'src/components/projects/ProjectIndexList.astro',
];

test('public source copy follows the rescue guardrails', () => {
  for (const file of sourceSurfaces) {
    assert.doesNotMatch(read(file), bannedPublicCopy, `${file} should avoid old public-copy phrases`);
  }

  assert.match(read('src/content/pages/home.md'), /I build practical software across web apps/);
  assert.match(read('src/pages/projects/index.astro'), /Selected work across games/);
  assert.match(read('src/content/resume/overview.md'), /Open or download my current resume as a PDF/);
  assert.match(read('src/pages/contact.astro'), /Send me a note about a role, project, or consulting opportunity/);
});

test('built public pages keep the same direct public-facing tone', () => {
  build();
  for (const file of publicPageFiles) {
    const body = stripHead(read(file));
    assert.doesNotMatch(body, bannedPublicCopy, `${file} should avoid old public-copy phrases`);
  }
});
