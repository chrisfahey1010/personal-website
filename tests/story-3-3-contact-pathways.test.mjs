import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const getPrimaryContactEmail = () => {
  const contactConfig = read('src/config/contact.ts');
  const match = contactConfig.match(/primaryContactEmail\s*=\s*'([^']+)'/);

  assert.ok(match, 'contact config should expose the canonical primary contact email');

  return match[1];
};

test('story 3.3: canonical contact config stays bounded and reusable', () => {
  const contactConfig = read('src/config/contact.ts');
  const homeSource = read('src/pages/index.astro');
  const journeySource = read('src/components/journey/JourneyNextStep.astro');
  const contactSource = read('src/pages/contact.astro');

  assert.match(contactConfig, /primaryContactEmail/, 'contact config should keep the direct email in one canonical module');
  assert.match(contactConfig, /primaryContactHref/, 'contact config should export the mailto destination from that canonical module');
  assert.match(homeSource, /launchRoutes/, 'homepage should use canonical routes when exposing the contact path');
  assert.match(homeSource, /JourneyNextStep|Start a conversation|launchRoutes\.contact/, 'homepage should expose the contact handoff through the shared journey pattern');
  assert.match(journeySource, /actions\.map|project-card-link/, 'shared journey handoff component should render the reusable page-level CTA pattern');
  assert.match(contactSource, /what to send|how to reach out|best context/i, 'contact page should explain the next outreach action in plain language');
});

test('story 3.3: built pages expose clear, privacy-conscious contact pathways', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });
  const primaryContactEmail = getPrimaryContactEmail();

  const homeHtml = read('dist/index.html');
  const projectsHtml = read('dist/projects/index.html');
  const detailHtml = read('dist/projects/portfolio-refresh/index.html');
  const resumeHtml = read('dist/resume/index.html');
  const contactHtml = read('dist/contact/index.html');

  assert.match(homeHtml, /href="\/contact\/"[^>]*>(Start a conversation|Contact Chris)</, 'homepage should expose a page-level contact handoff');
  assert.match(homeHtml, /contact|conversation|follow up/i, 'homepage should frame contact as a valid next step');

  assert.match(projectsHtml, /href="\/contact\/"[^>]*>Start a conversation</, 'projects index should expose a direct contact path');
  assert.match(detailHtml, /href="\/contact\/"[^>]*>Start a conversation</, 'project detail should expose a direct contact path');
  assert.match(resumeHtml, /href="\/contact\/"[^>]*>Continue to contact</, 'resume should preserve the final contact handoff');

  assert.match(contactHtml, /what to send|role, team, project, or timing|best context/i, 'contact page should tell visitors what context helps the outreach');
  assert.match(contactHtml, new RegExp(`mailto:${primaryContactEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), 'contact page should still use a standard mailto path');
  assert.doesNotMatch(contactHtml, /<form\b|type="submit"|fetch\(|XMLHttpRequest|client:load|client:idle|client:visible|client:only/, 'contact path should stay static and anchor-based');

  const exposedEmails = Array.from(contactHtml.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi), (match) => match[0].toLowerCase());
  assert.deepEqual([...new Set(exposedEmails)], [primaryContactEmail.toLowerCase()], 'contact page should expose only one direct email address');
});
