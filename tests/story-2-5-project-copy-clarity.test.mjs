import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const stripHead = (html) => html.replace(/<head>[\s\S]*?<\/head>/i, '');

test('story 2.5 subtask 1: portfolio project copy stays direct and recruiter-friendly', () => {
  const portfolioSource = read('src/content/projects/portfolio-refresh.md');

  assert.match(
    portfolioSource,
    /summary: Rebuilt this portfolio as a static-first Astro site that helps recruiters, hiring managers, and clients understand Chris's work quickly\./,
    'portfolio summary should explain value directly',
  );
  assert.match(
    portfolioSource,
    /overview: Built a static-first portfolio that makes Chris's role, selected work, and contact path easy to review on any device\./,
    'portfolio overview should stay concrete and easy to scan',
  );

  const bannedPhrases = /proof story|storytelling system|evaluation flow|fit, proof, and next steps|technical proof|deep proof pages/i;

  assert.doesNotMatch(portfolioSource, bannedPhrases, 'portfolio source should drop inward-facing project framing');
});

test('story 2.5 subtask 1: portfolio project output stays direct and recruiter-friendly', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const portfolioHtml = stripHead(read('dist/projects/portfolio-refresh/index.html'));

  assert.match(
    portfolioHtml,
    /Rebuilt this portfolio as a static-first Astro site that helps recruiters, hiring managers, and clients understand Chris(?:&#39;s|'s) work quickly\./,
    'portfolio detail page should expose the rewritten summary',
  );
  assert.match(
    portfolioHtml,
    /Built a static-first portfolio that makes Chris(?:&#39;s|'s) role, selected work, and contact path easy to review on any device\./,
    'portfolio detail page should expose the rewritten overview',
  );
  assert.doesNotMatch(
    portfolioHtml,
    /proof story|storytelling system|evaluation flow|fit, proof, and next steps|technical proof|deep proof pages/i,
    'portfolio detail output should avoid inward-facing project framing',
  );
});

test('story 2.5 subtask 2: dashboard project copy stays direct and recruiter-friendly', () => {
  const dashboardSource = read('src/content/projects/team-dashboard-modernization.md');

  assert.match(
    dashboardSource,
    /summary: Redesigned an internal operations dashboard so operators, managers, and engineering partners could spot work status, blockers, and delivery risk faster\./,
    'dashboard summary should explain value directly',
  );
  assert.match(
    dashboardSource,
    /overview: Modernized an internal dashboard so teams could understand work status, delivery risk, and needed action without decoding inconsistent UI states\./,
    'dashboard overview should stay concrete and easy to scan',
  );

  const bannedPhrases = /proof trail|proof story|storytelling system|evaluation flow|meta commentary/i;

  assert.doesNotMatch(dashboardSource, bannedPhrases, 'dashboard source should avoid inward-facing project framing');
});

test('story 2.5 subtask 2: dashboard project output stays direct and recruiter-friendly', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const dashboardHtml = stripHead(read('dist/projects/team-dashboard-modernization/index.html'));

  assert.match(
    dashboardHtml,
    /Redesigned an internal operations dashboard so operators, managers, and engineering partners could spot work status, blockers, and delivery risk faster\./,
    'dashboard detail page should expose the rewritten summary',
  );
  assert.match(
    dashboardHtml,
    /Modernized an internal dashboard so teams could understand work status, delivery risk, and needed action without decoding inconsistent UI states\./,
    'dashboard detail page should expose the rewritten overview',
  );
  assert.doesNotMatch(
    dashboardHtml,
    /proof story|storytelling system|evaluation flow|meta commentary/i,
    'dashboard detail output should avoid inward-facing project framing',
  );
});

test('story 2.5 task 2: project-facing component copy drops inward-facing labels', () => {
  const structureSummary = read('src/components/projects/ProjectStructureSummary.astro');
  const projectIndex = read('src/pages/projects/index.astro');
  const projectDetailRoute = read('src/pages/projects/[slug].astro');
  const projectDetailPage = read('src/components/projects/ProjectDetailPage.astro');
  const projectHelper = read('src/lib/content/get-projects.ts');
  const siteMetadata = read('src/lib/seo/site-metadata.ts');

  assert.match(structureSummary, /<dt>Highlights<\/dt>/, 'project summary labels should use direct visitor-facing language');
  assert.match(structureSummary, /Open the full project page for the full context, decisions, and next steps\./, 'preview helper copy should stay direct');
  assert.match(structureSummary, /Use the links below to continue to projects, resume, or contact\./, 'detail helper copy should stay direct');
  assert.match(projectIndex, /<h1>Selected projects, written for quick review\.<\/h1>/, 'projects index should use recruiter-friendly framing');
  assert.match(projectIndex, /Choose the project that best matches the conversation\./, 'comparison heading should stay direct');
  assert.match(projectDetailRoute, /<p class="route-eyebrow">Project<\/p>/, 'project detail route should drop proof-centric eyebrow copy');
  assert.match(projectDetailPage, /A clear view of the work, the constraints, and the decisions behind it\./, 'project detail heading should stay concrete');
  assert.match(projectDetailPage, /<p class="route-eyebrow">Work in practice<\/p>/, 'project detail evidence section should use direct visitor-facing language');
  assert.match(projectHelper, /heading: 'Clear context before you review the details\.'/, 'project helper should keep the overview heading direct');
  assert.match(projectHelper, /ctaLabel: `Review \$\{entry\.data\.title\} details`/, 'project links should describe the detail page directly');
  assert.match(siteMetadata, /compare context, role, outcomes, and the next relevant page\./, 'projects metadata should stay aligned with the public-facing tone');

  const bannedPhrases = /Proof focus|proof trail|Project proof|storytelling modules|deepen the proof trail|Review \$\{entry\.data\.title\} proof|deeper proof|inspect the proof|Proof in practice/i;

  assert.doesNotMatch(structureSummary, bannedPhrases, 'project summary component should avoid proof-centric labels');
  assert.doesNotMatch(projectIndex, bannedPhrases, 'projects index should avoid proof-centric labels');
  assert.doesNotMatch(projectDetailRoute, bannedPhrases, 'project detail route should avoid proof-centric labels');
  assert.doesNotMatch(projectDetailPage, bannedPhrases, 'project detail page should avoid proof-centric labels');
  assert.doesNotMatch(projectHelper, bannedPhrases, 'project helper should avoid proof-centric labels');
  assert.doesNotMatch(siteMetadata, bannedPhrases, 'projects metadata should avoid proof-centric labels');
});

test('story 2.5 task 2: built project pages keep direct labels across index and detail views', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const projectsHtml = stripHead(read('dist/projects/index.html'));
  const portfolioHtml = stripHead(read('dist/projects/portfolio-refresh/index.html'));

  assert.match(projectsHtml, /Selected projects, written for quick review\./, 'projects index should expose the rewritten heading');
  assert.match(projectsHtml, /Choose the project that best matches the conversation\./, 'projects index should expose the rewritten comparison heading');
  assert.match(projectsHtml, /Review Personal Website Refresh details/, 'project links should describe the detail page directly');
  assert.match(portfolioHtml, /<dt>Highlights<\/dt>/, 'project detail summary should use the rewritten label');
  assert.match(portfolioHtml, /A clear view of the work, the constraints, and the decisions behind it\./, 'project detail page should expose the rewritten heading');
  assert.match(portfolioHtml, /Work in practice/, 'project detail page should expose the rewritten evidence eyebrow');
  assert.match(portfolioHtml, /Clear context before you review the details\./, 'project detail page should expose the rewritten overview heading');
  assert.match(portfolioHtml, /Use the links below to continue to projects, resume, or contact\./, 'project detail helper copy should stay direct');

  const bannedPhrases = /Proof focus|proof trail|Project proof|storytelling modules|deepen the proof trail|Review [^<]+ proof|deeper proof|inspect the proof|Proof in practice/i;

  assert.doesNotMatch(projectsHtml, bannedPhrases, 'projects index output should avoid proof-centric labels');
  assert.doesNotMatch(portfolioHtml, bannedPhrases, 'project detail output should avoid proof-centric labels');
});
