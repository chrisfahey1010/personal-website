import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const stripHead = (html) => html.replace(/<head>[\s\S]*?<\/head>/i, '');

test('story 4.6: planning artifacts expose one lightweight editorial baseline', () => {
  const prd = read('_bmad-output/planning-artifacts/prd.md');
  const ux = read('_bmad-output/planning-artifacts/ux-design-specification.md');
  const architecture = read('_bmad-output/planning-artifacts/architecture.md');
  const epics = read('_bmad-output/planning-artifacts/epics.md');

  const baselineHeading = /Public Copy Guardrails/;
  const baselineTone = /concise, confident, recruiter-friendly, and user-value-first/i;
  const reviewSurfaces = /homepage, projects, resume, and contact/i;
  const metaException = /recovery or error handling/i;

  assert.match(prd, baselineHeading, 'PRD should expose a lightweight public copy baseline');
  assert.match(prd, baselineTone, 'PRD should define the expected public copy tone');
  assert.match(ux, baselineHeading, 'UX spec should make the baseline easy to find during design and implementation');
  assert.match(ux, reviewSurfaces, 'UX spec should name the highest-visibility review surfaces');
  assert.match(architecture, baselineHeading, 'architecture should carry the same reusable editorial baseline');
  assert.match(architecture, metaException, 'architecture should limit internal-process language to recovery or error states');
  assert.match(epics, baselineHeading, 'epics should keep the guardrails easy to reference from backlog work');
  assert.match(epics, reviewSurfaces, 'epics should name the same review surfaces for future story planning');
});

test('story 4.6: new story drafts can cite the editorial baseline directly', () => {
  const template = read('_bmad/bmm/workflows/4-implementation/create-story/template.md');

  assert.match(template, /Public Copy Guardrails/i, 'story template should point future copy stories to the editorial baseline');
  assert.match(template, /homepage, projects, resume, and contact/i, 'story template should identify the review surfaces for copy changes');
  assert.match(template, /recovery or error handling/i, 'story template should clarify the narrow exception for internal-process language');
});

test('story 4.6: source copy across public surfaces avoids internal-process narration', () => {
  const home = read('src/content/pages/home.md');
  const projectsIndex = read('src/pages/projects/index.astro');
  const projectDetail = read('src/components/projects/ProjectDetailPage.astro');
  const resume = read('src/content/resume/overview.md');
  const contact = read('src/pages/contact.astro');

  const bannedPhrases = /evaluation logic|evaluation flow|evaluation path|handoff mechanics|design rationale|implementation intent|global navigation alone|page-level next step|fallback path visible at all times|project proof/i;

  assert.match(home, /Continue to projects to review the delivery choices, tradeoffs, and outcomes\./, 'homepage should frame the next step directly');
  assert.match(projectsIndex, /Each project opens on a normal detail page with standard browser navigation/, 'projects index should describe behavior in visitor-facing language');
  assert.match(projectsIndex, /Continue to the resume when you want the formal experience\./, 'projects index should keep the next step concise');
  assert.match(resume, /Review the resume and choose the next step\./, 'resume page should stay direct and action-oriented');
  assert.match(contact, /The plain-text address below stays visible so you always have a direct fallback\./, 'contact page should explain the fallback in visitor-facing language');
  assert.match(projectDetail, /formal experience behind the work/, 'project detail can still describe user value directly');

  assert.doesNotMatch(home, bannedPhrases, 'homepage should avoid internal-process narration');
  assert.doesNotMatch(projectsIndex, bannedPhrases, 'projects index should avoid internal-process narration');
  assert.doesNotMatch(resume, bannedPhrases, 'resume page should avoid internal-process narration');
  assert.doesNotMatch(contact, bannedPhrases, 'contact page should avoid internal-process narration');
  assert.doesNotMatch(projectDetail, bannedPhrases, 'project detail page should avoid internal-process narration');
});

test('story 4.6: built public pages keep the same direct public-facing tone', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const homeHtml = stripHead(read('dist/index.html'));
  const projectsHtml = stripHead(read('dist/projects/index.html'));
  const resumeHtml = stripHead(read('dist/resume/index.html'));
  const contactHtml = stripHead(read('dist/contact/index.html'));

  const bannedPhrases = /evaluation logic|evaluation flow|evaluation path|handoff mechanics|design rationale|implementation intent|global navigation alone|page-level next step|fallback path visible at all times|project proof/i;

  assert.match(homeHtml, /Continue to projects to review the delivery choices, tradeoffs, and outcomes\./, 'homepage output should keep the direct next-step framing');
  assert.match(projectsHtml, /Each project opens on a normal detail page with standard browser navigation/, 'projects output should describe navigation directly');
  assert.match(projectsHtml, /Continue to the resume when you want the formal experience\./, 'projects output should keep the concise next step');
  assert.match(resumeHtml, /Review the resume and choose the next step\./, 'resume output should stay direct and action-oriented');
  assert.match(contactHtml, /The plain-text address below stays visible so you always have a direct fallback\./, 'contact output should keep the fallback direct');

  assert.doesNotMatch(homeHtml, bannedPhrases, 'homepage output should avoid internal-process narration');
  assert.doesNotMatch(projectsHtml, bannedPhrases, 'projects output should avoid internal-process narration');
  assert.doesNotMatch(resumeHtml, bannedPhrases, 'resume output should avoid internal-process narration');
  assert.doesNotMatch(contactHtml, bannedPhrases, 'contact output should avoid internal-process narration');
});
