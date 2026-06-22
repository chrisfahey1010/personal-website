import test from 'node:test';
import assert from 'node:assert/strict';
import { bannedPublicCopy, build, projectFileNames, read, stripHead } from './helpers.mjs';

test('project source copy is concrete and not self-referential', () => {
  for (const file of projectFileNames) {
    const source = read(`src/content/projects/${file}`);
    assert.doesNotMatch(source, bannedPublicCopy);
    assert.match(source, /summary: .{40,}/);
    assert.doesNotMatch(source, /calm|credible|evaluation|proof/i);
  }
});

test('built projects page keeps the same concise copy contract', () => {
  build();
  const body = stripHead(read('dist/projects/index.html'));

  assert.match(body, /Selected work across games, web apps, AI tooling, geospatial data, and portfolio infrastructure\./);
  assert.match(body, /Browser fishing game built with TypeScript/);
  assert.match(body, /Static concert photography portfolio rebuilt with Next\.js/);
  assert.doesNotMatch(body, bannedPublicCopy);
});
