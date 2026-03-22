import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const readDistCss = () => {
  const astroDir = path.join(root, 'dist/_astro');
  const cssFiles = fs.readdirSync(astroDir).filter((file) => file.endsWith('.css'));

  return cssFiles.map((file) => fs.readFileSync(path.join(astroDir, file), 'utf8')).join('\n');
};

test('story 3.4: contact source stays static-first and recovery-oriented', () => {
  const contactSource = read('src/pages/contact.astro');

  assert.match(contactSource, /What happens next/i, 'contact page should explain the intended mail handoff in plain language');
  assert.match(contactSource, /If your mail app does not open/i, 'contact page should explain the fallback state in plain language');
  assert.match(contactSource, /copy the plain-text address below into any mail app you\s+prefer/i, 'contact page should offer a non-mailto recovery instruction');
  assert.match(contactSource, /<code class="contact-direct-address">\{primaryContactEmail\}<\/code>/, 'contact page should expose a plain-text email fallback instead of only another mailto link');
  assert.match(contactSource, /Review the resume again|Back to projects|Continue through projects/i, 'contact page should preserve a trustworthy next step');
  assert.doesNotMatch(contactSource, /<form\b|fetch\(|XMLHttpRequest|client:load|client:idle|client:visible|client:only/, 'contact page should remain static-first and not add a heavier workflow');
});

test('story 3.4: built contact page explains handoff, fallback, and accessible recovery', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const contactHtml = read('dist/contact/index.html');
  const builtCss = readDistCss();
  const h1Matches = contactHtml.match(/<h1\b[^>]*>/g) ?? [];
  const mainMatches = contactHtml.match(/<main\b[^>]*id="main-content"/g) ?? [];

  assert.equal(h1Matches.length, 1, 'contact page should keep exactly one h1');
  assert.equal(mainMatches.length, 1, 'contact page should keep exactly one main landmark');
  assert.match(contactHtml, /What happens next/i, 'built contact page should explain the intended handoff');
  assert.match(contactHtml, /If your mail app does not open/i, 'built contact page should include plain-language fallback guidance');
  assert.match(contactHtml, /copy the plain-text address below into any mail app you\s+prefer/i, 'built contact page should keep a trustworthy non-mailto recovery path visible in text');
  assert.match(contactHtml, /<code class="contact-direct-address">[^<]+<\/code>/, 'built contact page should render a plain-text email fallback');
  assert.match(contactHtml, /aria-label="Email fallback guidance"|aria-labelledby="contact-recovery-heading"/, 'recovery guidance should expose an accessible text-based grouping');
  const mailtoMatches = contactHtml.match(/href="mailto:[^"]+"/g) ?? [];
  assert.equal(mailtoMatches.length, 1, 'contact page should keep one primary mailto action and avoid making the fallback depend on the same handoff');
  assert.match(contactHtml, /href="\/resume\/"|href="\/projects\/"/, 'contact page should preserve at least one onward route when email handoff fails');
  assert.match(contactHtml, /<a class="project-card-link" href="mailto:[^"]+">Email Chris<\/a>/, 'primary contact action should remain a keyboard-reachable anchor with visible text');
  assert.match(contactHtml, /Direct email<\/span>\s*<code class="contact-direct-address">[^<]+<\/code>/, 'fallback meaning should stay visible in text rather than color alone');
  assert.doesNotMatch(contactHtml, /<form\b|type="submit"|fetch\(|XMLHttpRequest|client:load|client:idle|client:visible|client:only/, 'built contact page should remain anchor-based and static-first');
  assert.match(builtCss, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*\.editorial-reveal\{animation:none/, 'contact presentation should remain understandable without motion');
  assert.match(builtCss, /\.contact-direct-address\{[\s\S]*border:1px solid/, 'plain-text fallback should receive its own visible treatment independent of accent color');
});
