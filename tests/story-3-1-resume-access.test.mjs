import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build, buildEnv, exists, read, root } from './helpers.mjs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const canonicalResumeAsset = path.join(root, 'public/resume/chris-resume.pdf');
const missingResumeAsset = path.join(root, 'public/resume/chris-resume.pdf.bak-test');

test('resume helper centralizes PDF availability and concise copy', () => {
  assert.equal(exists('public/resume/chris-resume.pdf'), true);
  const helper = read('src/lib/content/get-resume.ts');
  const source = read('src/content/resume/overview.md');
  const route = read('src/pages/resume.astro');

  assert.match(helper, /resumeAssetPath\s*=\s*'\/resume\/chris-resume\.pdf'/);
  assert.match(helper, /getResumeFreshnessState/);
  assert.doesNotMatch(helper, /highlights|summary|nextStepCopy|metaItems/);
  assert.match(source, /^intro: Open or download my current resume as a PDF\.$/m);
  assert.match(route, /View resume|Download PDF|resumePage\.fallbackCopy/);
  assert.doesNotMatch(route, /resume-summary|route-meta/);
});

test('resume page links to the PDF when available', () => {
  build();
  const html = read('dist/resume/index.html');
  assert.match(html, /<h1[^>]*>Resume<\/h1>/);
  assert.match(html, /href="\/resume\/chris-resume\.pdf"/);
  assert.match(html, /View resume/);
  assert.match(html, /Download PDF/);
  assert.equal(exists('dist/resume/chris-resume.pdf'), true);
});

test('missing PDF mode shows a truthful fallback and no broken asset buttons', () => {
  fs.renameSync(canonicalResumeAsset, missingResumeAsset);
  try {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });
    const html = read('dist/resume/index.html');
    assert.match(html, /resume PDF is temporarily unavailable/i);
    assert.match(html, /href="\/contact\/"/);
    assert.doesNotMatch(html, />View resume</);
    assert.doesNotMatch(html, />Download PDF</);
  } finally {
    fs.renameSync(missingResumeAsset, canonicalResumeAsset);
  }
});
