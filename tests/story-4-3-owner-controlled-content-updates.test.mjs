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

test('story 4.3 task 1 and 2: homepage and resume updates stay content-authored and schema-backed', () => {
  const contentConfig = read('src/content/config.ts');
  const homeContent = read('src/content/pages/home.md');
  const resumeContent = read('src/content/resume/overview.md');
  const homeHelperSource = read('src/lib/content/get-home-page.ts');
  const resumeHelperSource = read('src/lib/content/get-resume.ts');

  assert.match(contentConfig, /const resumeHighlightsSchema = z\.object\(/, 'resume content should be validated in the content config');
  assert.match(contentConfig, /const resume = defineCollection\(/, 'resume collection should be defined in the shared content config');
  assert.match(contentConfig, /heroCredibilityBullets: z\.array\(nonEmptyString\)\.min\(1\)\.max\(4\)/, 'homepage credibility bullets should be content-authored and bounded');
  assert.match(contentConfig, /heroSignalCopy: nonEmptyString/, 'homepage professional signal copy should be schema-backed');
  assert.match(contentConfig, /resume,/, 'resume collection should be exported through the shared collections map');

  assert.match(homeContent, /^heroEyebrow:\s+.+$/m, 'homepage eyebrow copy should be editable in content');
  assert.match(homeContent, /^heroCredibilityBullets:\s*$/m, 'homepage credibility bullets should be authored in content');
  assert.match(homeContent, /^heroSignalCopy:\s+.+$/m, 'homepage signal copy should be authored in content');

  assert.match(resumeContent, /^title:\s+Resume$/m, 'resume content entry should provide the route title');
  assert.match(resumeContent, /^seoTitle:\s+.+$/m, 'resume content entry should own the resume metadata title');
  assert.match(resumeContent, /^eyebrow:\s+.+$/m, 'resume content entry should own the visible route eyebrow');
  assert.match(resumeContent, /^updatedAt:\s+"?\d{4}-\d{2}-\d{2}"?$/m, 'resume content entry should own freshness metadata');
  assert.match(resumeContent, /^maxAgeDays:\s+\d+$/m, 'resume content entry should own stale-threshold metadata');
  assert.match(resumeContent, /^highlights:\s*$/m, 'resume content entry should own the resume summary highlights');

  assert.match(homeHelperSource, /getEntry\('pages', 'home'\)/, 'homepage content should load through a shared helper');
  assert.match(homeHelperSource, /hero:\s*\{/, 'homepage helper should expose a normalized hero contract');
  assert.match(homeHelperSource, /journeyNextStep:\s*\{/, 'homepage helper should expose a normalized journey-next-step contract');
  assert.match(homeHelperSource, /createPageMetadata\(/, 'homepage helper should centralize page metadata shaping');

  assert.match(resumeHelperSource, /'resume', 'overview'/, 'resume content should load through the content collection model');
  assert.match(resumeHelperSource, /getResumePageContent\s*=\s*async\s*\(\)\s*:\s*Promise<ResumePageContent>\s*=>/, 'resume helper should expose a normalized page contract');
  assert.match(resumeHelperSource, /title:\s*content\.seoTitle/, 'resume helper should delegate metadata title to owner-authored content');
  assert.match(resumeHelperSource, /eyebrow:\s*content\.eyebrow/, 'resume helper should render the visible route eyebrow from owner-authored content');
  assert.match(resumeHelperSource, /highlights:\s*content\.highlights\.map/, 'resume helper should normalize state-aware highlight copy');
});

test('story 4.3 task 3 and 4: homepage and resume routes stay thin and render owner-authored copy', () => {
  const indexRoute = read('src/pages/index.astro');
  const resumeRoute = read('src/pages/resume.astro');

  assert.match(indexRoute, /from '\.\.\/lib\/content\/get-home-page'/, 'homepage route should consume a shared home-content helper');
  assert.match(indexRoute, /const homePage = await getHomePage\(\);/, 'homepage route should delegate homepage shaping to the helper');
  assert.match(indexRoute, /<HeroSection \{\.\.\.homePage\.hero\} \/>/, 'homepage route should pass the normalized hero contract directly');
  assert.match(indexRoute, /title=\{homePage\.journeyNextStep\.title\}/, 'homepage route should render next-step title from the shared content helper');
  assert.match(indexRoute, /intro=\{homePage\.journeyNextStep\.intro\}/, 'homepage route should render next-step intro from the shared content helper');

  assert.match(resumeRoute, /getResumePageContent/, 'resume route should consume a normalized resume page helper');
  assert.match(resumeRoute, /const resumePage = await getResumePageContent\(\);/, 'resume route should delegate resume shaping to the helper');
  assert.doesNotMatch(resumeRoute, /const pageDescription = hasResumeAsset/, 'resume route should not own stateful resume copy inline anymore');
  assert.doesNotMatch(resumeRoute, /const resumePrimaryIntro = hasResumeAsset/, 'resume route should not hardcode stateful intro copy inline anymore');

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const indexHtml = read('dist/index.html');
  const resumeHtml = read('dist/resume/index.html');

  assert.match(indexHtml, /Warm editorial portfolio/, 'homepage should still render the authored eyebrow copy');
  assert.match(indexHtml, /Product engineering shaped for senior IC and staff-level evaluation/, 'homepage should render authored credibility bullets');
  assert.match(indexHtml, /Product judgment, hands-on delivery, and content clarity shaped into one visible first impression/, 'homepage should render authored signal copy');
  assert.match(indexHtml, /Continue from first impression into proof, resume, or direct outreach\./, 'homepage should render owner-authored next-step framing');
  assert.match(resumeHtml, /Review the resume without losing the thread of evaluation\./, 'resume page should render the authored title');
  assert.match(resumeHtml, /<title>Resume \| Chris Fahey<\/title>/, 'resume page should render the authored metadata title');
  assert.match(resumeHtml, /<p class="route-eyebrow">Resume<\/p>/, 'resume page should render the authored eyebrow copy');
  assert.match(resumeHtml, /Resume PDF unavailable right now|View resume/, 'resume page should still render truthful availability-dependent actions');
  assert.doesNotMatch(indexHtml, /client:load|client:idle|client:visible|client:only/, 'homepage should remain static-first');
  assert.doesNotMatch(resumeHtml, /client:load|client:idle|client:visible|client:only/, 'resume page should remain static-first');
});

test('story 4.3 task 5 and 6: owner-update seams stay truthful when the resume asset is missing', () => {
  fs.renameSync(canonicalResumeAsset, missingResumeAsset);

  try {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

    const resumeHtml = read('dist/resume/index.html');

    assert.match(resumeHtml, /Resume PDF unavailable right now/, 'fallback guidance should still come from the owner-authored seam');
    assert.match(resumeHtml, /request the latest copy/i, 'fallback guidance should preserve the recovery path');
    assert.doesNotMatch(resumeHtml, />View resume</, 'missing asset mode should remove the direct resume action');
    assert.doesNotMatch(resumeHtml, />Download PDF</, 'missing asset mode should remove the download action');
  } finally {
    fs.renameSync(missingResumeAsset, canonicalResumeAsset);
  }

  assert.equal(exists('src/content/resume/overview.md'), true, 'resume content entry should exist in source control');
  assert.equal(exists('public/resume/chris-resume.pdf'), true, 'canonical resume PDF should remain in the public asset boundary');
});
