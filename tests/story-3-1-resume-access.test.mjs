import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const canonicalResumeAsset = path.join(root, 'public/resume/chris-resume.pdf');
const missingResumeAsset = path.join(root, 'public/resume/chris-resume.pdf.bak-test');

const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));

test('story 3.1 task 1: resume access is centralized around a real public asset path', () => {
  assert.equal(exists('src/lib/content/get-resume.ts'), true, 'resume helper should centralize the canonical asset path');
  assert.equal(exists('public/resume/chris-resume.pdf'), true, 'resume PDF should live in the public asset boundary');
  assert.equal(exists('src/content/resume/overview.md'), true, 'resume copy should live in a source-controlled content entry');

  const helperSource = read('src/lib/content/get-resume.ts');
  const routeSource = read('src/pages/resume.astro');

  assert.match(helperSource, /resumeAssetPath\s*=\s*'\/resume\/chris-resume\.pdf'/, 'helper should expose the canonical public resume path');
  assert.match(helperSource, /fs\.existsSync/, 'helper should guard against shipping a missing canonical resume asset');
  assert.match(helperSource, /getResumeFreshnessState/, 'helper should model missing, stale, and available resume states explicitly');
  assert.match(helperSource, /state:\s*ResumeAssetState/, 'helper should model missing, stale, and available resume states explicitly');
  assert.match(helperSource, /loadResumeEntry/, 'helper should load owner-authored resume content through a shared seam');
  assert.match(helperSource, /getResumePageContent\s*=\s*async/, 'helper should expose a normalized resume page contract');
  assert.match(helperSource, /title:\s*content\.seoTitle/, 'helper should let owner-authored resume content drive the metadata title');
  assert.match(helperSource, /eyebrow:\s*content\.eyebrow/, 'helper should let owner-authored resume content drive the visible eyebrow');
  assert.match(helperSource, /content\.updatedAt/, 'helper should track when the canonical resume was last refreshed from content');
  assert.match(helperSource, /content\.highlights\.map/, 'helper should expose state-aware resume summary content');
  assert.match(routeSource, /from '\.\.\/lib\/content\/get-resume'/, 'resume route should stay thin and use the canonical helper');
  assert.match(routeSource, /getResumePageContent/, 'resume route should request normalized resume page data from the helper');
  assert.match(routeSource, /resumePage\.actions\.viewLabel/, 'resume route should offer a clear view action');
  assert.match(routeSource, /resumePage\.actions\.downloadLabel/, 'resume route should offer a clear download action');
  assert.match(routeSource, /resumePage\.fallback\?\.title/, 'resume route should include an inline fallback path when the PDF cannot be trusted');
  assert.doesNotMatch(routeSource, /const pageDescription = hasResumeAsset/, 'resume route metadata should be delegated to the helper');
  assert.doesNotMatch(routeSource, /target="_blank"|target=_blank/, 'resume route should preserve normal same-tab navigation for the primary resume view action');
  assert.doesNotMatch(routeSource, /docs\/Resume_ChrisFahey\.pdf/, 'resume route must not link into the repo-only docs path');
  assert.doesNotMatch(routeSource, /client:load|client:idle|client:visible|client:only/, 'resume access should remain hydration-free');
});

test('story 3.1 task 2 and 3: built resume page keeps evaluators oriented and links only to a real built asset', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  assert.equal(exists('dist/resume/index.html'), true, 'resume route should build');
  assert.equal(exists('dist/resume/chris-resume.pdf'), true, 'canonical resume PDF should be present in the final build');

  const html = read('dist/resume/index.html');
  const h1Matches = html.match(/<h1\b[^>]*>/g) ?? [];
  const currentMatches = html.match(/aria-current="page"/g) ?? [];

  assert.equal(h1Matches.length, 1, 'resume route should keep exactly one h1');
  assert.equal(currentMatches.length, 1, 'resume route should keep exactly one current nav item');
  assert.match(html, /href="\/resume\/chris-resume\.pdf"/, 'resume page should link to the built public PDF path');
  assert.match(html, /<title>Resume \| Chris Fahey<\/title>/, 'resume route should emit the owner-authored metadata title');
  assert.match(html, /View resume/, 'resume page should expose a clear inline-view action');
  assert.match(html, /Download PDF/, 'resume page should expose a clear download action');
  assert.match(html, /projects/i, 'resume page should preserve a visible path back to proof');
  assert.match(html, /contact/i, 'resume page should preserve a visible onward path to outreach');
  assert.match(html, /If the PDF is unavailable or needs an update/i, 'resume page should include a fallback-safe recovery message');
  assert.doesNotMatch(html, /docs\/Resume_ChrisFahey\.pdf/, 'built output must not expose the repo-only docs path');
});

test('story 3.1 task 2 and 3: missing PDF still leaves /resume/ useful without broken asset actions', () => {
  fs.renameSync(canonicalResumeAsset, missingResumeAsset);

  try {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

    assert.equal(exists('dist/resume/index.html'), true, 'resume route should still build when the PDF is temporarily unavailable');
    assert.equal(exists('dist/resume/chris-resume.pdf'), false, 'build output should not pretend the missing PDF still exists');

    const html = read('dist/resume/index.html');

    assert.match(html, /Resume PDF unavailable right now/, 'resume route should explain that the PDF is unavailable');
    assert.match(html, /summary here and clear paths back to projects or forward to contact/i, 'resume route should keep evaluation flow intact when the PDF is missing');
    assert.match(html, /requesting the latest copy/i, 'resume route should preserve a recovery path for the latest resume copy');
    assert.match(html, /resume entry point that keeps evaluators oriented with a summary and recovery path while the canonical PDF is unavailable/i, 'resume metadata should stay truthful when the PDF is missing');
    assert.match(html, /Use this summary when you need the core professional context right now/i, 'resume summary intro should stay truthful in fallback mode');
    assert.match(html, /A resume summary that captures the core experience/i, 'resume highlights should avoid claiming a current PDF when the asset is missing');
    assert.doesNotMatch(html, /The PDF is framed as current professional material before you open it/i, 'fallback mode should remove contradictory current-PDF framing');
    assert.doesNotMatch(html, /Use the PDF when you want the complete professional record/i, 'fallback mode should not promise a PDF action that is unavailable');
    assert.doesNotMatch(html, />View resume</, 'resume route should remove the view action when the PDF is missing');
    assert.doesNotMatch(html, />Download PDF</, 'resume route should remove the download action when the PDF is missing');
    assert.match(html, /missing, stale, or being replaced/i, 'fallback copy should stay truthful for more than just an update-in-progress case');
  } finally {
    fs.renameSync(missingResumeAsset, canonicalResumeAsset);
  }
});

test('story 3.1 task 4 and 5: project-detail handoff still flows cleanly into resume and onward contact', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const portfolioHtml = read('dist/projects/portfolio-refresh/index.html');
  const dashboardHtml = read('dist/projects/team-dashboard-modernization/index.html');
  const resumeHtml = read('dist/resume/index.html');

  assert.match(portfolioHtml, /href="\/resume\/"[^>]*>Continue to resume</, 'project detail pages should still hand off into the resume route');
  assert.match(dashboardHtml, /href="\/resume\/"[^>]*>Continue to resume</, 'every project detail page should preserve the resume handoff');
  assert.match(resumeHtml, /href="\/projects\/"/, 'resume page should keep a route back to projects');
  assert.match(resumeHtml, /href="\/contact\/"/, 'resume page should keep a route onward to contact');
});
