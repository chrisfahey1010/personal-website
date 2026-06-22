import test from 'node:test';
import assert from 'node:assert/strict';
import { build, read } from './helpers.mjs';

test('project schema and helper support card discoverability', () => {
  const config = read('src/content/config.ts');
  const helper = read('src/lib/content/get-projects.ts');
  const list = read('src/components/projects/ProjectIndexList.astro');

  assert.match(config, /projectStatusSchema/);
  assert.match(config, /repositoryUrl: externalUrl/);
  assert.match(config, /sortOrder/);
  assert.match(config, /Deployed projects must include liveUrl/);
  assert.match(helper, /sortOrder/);
  assert.match(helper, /Duplicate project slug detected/);
  assert.match(list, /project-status-badge/);
  assert.match(list, /GitHub/);
  assert.match(list, /Live site/);
});

test('projects page emits crawlable metadata and semantic card markup', () => {
  build();
  const html = read('dist/projects/index.html');

  assert.match(html, /<title>Projects \| Chris Fahey<\/title>/);
  assert.match(html, /<meta name="description" content="Selected software projects by Chris Fahey/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.fahey\.vip\/projects\/"/);
  assert.match(html, /<ol[^>]*class="projects-list"/);
  assert.match(html, /<article[^>]*project-card/);
});
