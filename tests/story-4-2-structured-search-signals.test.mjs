import test from 'node:test';
import assert from 'node:assert/strict';
import { build, read } from './helpers.mjs';

test('structured search signals are limited to site/page-level static data', () => {
  assert.equal(read('src/pages/index.astro').includes('getSiteStructuredData'), true);
  assert.equal(read('src/pages/projects/index.astro').includes('StructuredData'), false);
  assert.equal(read('src/pages/resume.astro').includes('StructuredData'), false);
});

test('home page still emits WebSite structured data without per-project detail JSON-LD', () => {
  build();
  const home = read('dist/index.html');
  const projects = read('dist/projects/index.html');

  assert.match(home, /application\/ld\+json/);
  assert.match(home, /"@type":"WebSite"/);
  assert.doesNotMatch(projects, /"@type":"CreativeWork"/);
  assert.doesNotMatch(projects, /portfolio-refresh|team-dashboard-modernization/);
});
