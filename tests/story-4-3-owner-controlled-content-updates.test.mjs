import test from 'node:test';
import assert from 'node:assert/strict';
import { projectFileNames, read } from './helpers.mjs';

test('owner-controlled content updates stay in markdown and small helpers', () => {
  const config = read('src/content/config.ts');
  const projectsHelper = read('src/lib/content/get-projects.ts');

  assert.match(config, /defineCollection/);
  assert.match(config, /pages/);
  assert.match(config, /projects/);
  assert.match(config, /resume/);
  assert.match(projectsHelper, /getCollection\('projects'\)/);

  for (const file of projectFileNames) {
    const source = read(`src/content/projects/${file}`);
    assert.match(source, /^---/);
    assert.match(source, /^title:/m);
  }
});
