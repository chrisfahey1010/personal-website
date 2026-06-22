import test from 'node:test';
import assert from 'node:assert/strict';
import { build, publicPageFiles, read } from './helpers.mjs';

test('search metadata uses the new concise tone', () => {
  const siteMetadata = read('src/lib/seo/site-metadata.ts');
  const home = read('src/content/pages/home.md');

  assert.match(home, /seoTitle: Chris Fahey \| Software Engineer/);
  assert.match(home, /Software engineer with full-stack, backend, cloud, and AI-assisted development experience/);
  assert.match(siteMetadata, /Selected software projects by Chris Fahey/);
  assert.match(siteMetadata, /Open or download Chris Fahey's current software engineering resume/);
  assert.match(siteMetadata, /Contact Chris Fahey about software engineering roles/);
});

test('built public pages emit titles, descriptions, and canonicals', () => {
  build();
  for (const file of publicPageFiles) {
    const html = read(file);
    assert.match(html, /<title>[^<]+<\/title>/, `${file} should emit title`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${file} should emit description`);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.fahey\.vip\//, `${file} should emit absolute canonical`);
  }
});
