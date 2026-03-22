import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const stripHead = (html) => html.replace(/<head>[\s\S]*?<\/head>/i, '');

test('story 3.5: source copy stays direct across resume and contact', () => {
  const resumeSource = read('src/content/resume/overview.md');
  const contactSource = read('src/pages/contact.astro');
  const homeSource = read('src/content/pages/home.md');
  const portfolioProjectSource = read('src/content/projects/portfolio-refresh.md');

  assert.match(resumeSource, /kicker: Current resume/, 'resume copy should lead with a direct label instead of inward-facing framing');
  assert.match(resumeSource, /heading: Review the resume and choose the next step\./, 'resume heading should stay easy to scan');
  assert.match(resumeSource, /summaryHeading: What you can review in a few minutes\./, 'resume summary should explain value plainly');
  assert.match(contactSource, /<p class="route-kicker">Direct outreach<\/p>/, 'contact page should use a plain-language kicker');
  assert.match(contactSource, /<h1>Reach out directly\.<\/h1>/, 'contact page should lead with a clear action');
  assert.match(contactSource, /<h2 class="resume-fallback-title" id="contact-recovery-heading">If email does not open<\/h2>/, 'contact fallback heading should describe the real recovery state');

  const bannedPhrases = /Evaluation handoff|evaluation flow|evaluation path|proof flow|handoff from profile|Contact recovery guidance/i;
  assert.doesNotMatch(resumeSource, bannedPhrases, 'resume content should drop inward-facing evaluation framing');
  assert.doesNotMatch(contactSource, bannedPhrases, 'contact content should drop inward-facing evaluation framing');
  assert.doesNotMatch(homeSource, bannedPhrases, 'homepage content should stay aligned with the same direct public-facing tone');
  assert.doesNotMatch(portfolioProjectSource, bannedPhrases, 'project content should stay aligned with the same direct public-facing tone');
  assert.doesNotMatch(contactSource, /intentionally lightweight/i, 'contact helper text should focus on the visitor action instead of implementation intent');
});

test('story 3.5: built resume and contact pages stay concise and recruiter-friendly', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const resumeHtml = stripHead(read('dist/resume/index.html'));
  const contactHtml = stripHead(read('dist/contact/index.html'));
  const homeHtml = stripHead(read('dist/index.html'));
  const portfolioProjectHtml = stripHead(read('dist/projects/portfolio-refresh/index.html'));

  assert.match(resumeHtml, /Review the resume and choose the next step\./, 'resume page should open with direct action-oriented copy');
  assert.match(resumeHtml, /Open the current resume in your browser or download the PDF\./, 'resume page should explain the primary action plainly');
  assert.match(resumeHtml, /What you can review in a few minutes\./, 'resume summary should stay concise and skimmable');
  assert.match(resumeHtml, /If you need the latest resume copy, use contact and I will send it directly\./, 'resume fallback should keep a direct request path');
  assert.match(contactHtml, /Reach out directly\./, 'contact page should open with the simplest next step');
  assert.match(contactHtml, /Email is the fastest way to reach me\./, 'contact page should prioritize the primary action');
  assert.match(contactHtml, /If email does not open/i, 'contact page should keep fallback guidance only where it helps');
  assert.match(contactHtml, /Use the email address shown here if your mail app stays closed\./, 'contact page should keep the fallback path direct');

  const bannedPhrases = /evaluation flow|evaluation path|proof flow|handoff|system intent|Contact recovery guidance/i;
  assert.doesNotMatch(resumeHtml, bannedPhrases, 'resume output should avoid inward-facing framing');
  assert.doesNotMatch(contactHtml, bannedPhrases, 'contact output should avoid inward-facing framing');
  assert.doesNotMatch(homeHtml, bannedPhrases, 'homepage output should stay aligned with the same direct public-facing tone');
  assert.doesNotMatch(portfolioProjectHtml, bannedPhrases, 'project output should stay aligned with the same direct public-facing tone');
  assert.doesNotMatch(contactHtml, /intentionally lightweight/i, 'contact output should avoid implementation-facing helper text');
});
