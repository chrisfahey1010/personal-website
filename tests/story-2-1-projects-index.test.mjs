import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { allowedStatuses, build, exists, frontmatterValue, projectFileNames, projectTitles, read, root } from './helpers.mjs';

const projectsDir = path.join(root, 'src/content/projects');

test('projects content uses five real card-oriented entries', () => {
  const files = fs.readdirSync(projectsDir).filter((file) => file.endsWith('.md')).sort();
  assert.deepEqual(files, [...projectFileNames].sort());

  for (const file of projectFileNames) {
    const source = read(`src/content/projects/${file}`);
    assert.match(source, /^title:/m);
    assert.match(source, /^status:/m);
    assert.match(source, /^summary:/m);
    assert.match(source, /^repositoryUrl: https:\/\/github\.com\/chrisfahey1010\//m);
    assert.match(source, /^sortOrder:/m);
    assert.ok(allowedStatuses.includes(frontmatterValue(source, 'status')));

    if (frontmatterValue(source, 'status') === 'Deployed') {
      assert.match(source, /^liveUrl: https?:\/\//m);
    }

    assert.doesNotMatch(source, /context:|proofSections:|storyModules:|Personal Website Refresh|Team Dashboard Modernization/);
  }
});

test('projects index builds real cards with links and no detail pages', () => {
  build();
  const html = read('dist/projects/index.html');

  assert.equal(exists('dist/projects/index.html'), true);
  assert.equal(exists('dist/projects/castaway/index.html'), false, 'project detail pages should not be generated');
  for (const title of projectTitles) assert.match(html, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(html, /https:\/\/github\.com\/chrisfahey1010\/castaway/);
  assert.match(html, /https:\/\/castawayfishing\.net/);
  assert.match(html, /https:\/\/livenapalm\.com/);
  assert.match(html, /Deployed/);
  assert.match(html, /In-Development/);
  assert.match(html, /On-Hold/);
  assert.doesNotMatch(html, /Personal Website Refresh|Team Dashboard Modernization|Review .* details/);
});
