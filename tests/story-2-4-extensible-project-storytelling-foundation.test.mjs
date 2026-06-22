import test from 'node:test';
import assert from 'node:assert/strict';
import { read } from './helpers.mjs';

test('project storytelling foundation was replaced by a minimal project card foundation', () => {
  const config = read('src/content/config.ts');
  const list = read('src/components/projects/ProjectIndexList.astro');
  const css = read('src/styles/global.css');

  assert.doesNotMatch(config, /storyModules|proofSections|externalArtifacts|relevanceCues/);
  assert.match(list, /project-card-horizontal/);
  assert.match(list, /project\.summary/);
  assert.match(list, /project\.repositoryUrl/);
  assert.match(css, /\.project-card-horizontal/);
  assert.match(css, /\.project-status-deployed/);
});
