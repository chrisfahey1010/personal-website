import test from 'node:test';
import assert from 'node:assert/strict';
import { build, exists, read } from './helpers.mjs';

test('project detail architecture is intentionally removed from the public experience', () => {
  assert.equal(exists('src/pages/projects/[slug].astro'), false);
  assert.equal(exists('src/components/projects/ProjectDetailPage.astro'), false);
  assert.equal(exists('src/lib/seo/get-project-structured-data.ts'), false);

  const projectsHelper = read('src/lib/content/get-projects.ts');
  assert.doesNotMatch(projectsHelper, /getProjectBySlug|ProjectDetail|proofSections|storyModules/);
});

test('build output contains only the projects index under projects', () => {
  build();
  assert.equal(exists('dist/projects/index.html'), true);
  assert.equal(exists('dist/projects/castaway/index.html'), false);
  assert.equal(exists('dist/projects/livenapalm-site/index.html'), false);
});
