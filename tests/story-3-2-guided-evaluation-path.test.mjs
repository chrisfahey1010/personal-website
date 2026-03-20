import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildEnv = { ...process.env, NODE_OPTIONS: '' };
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');

test('story 3.2: journey handoff sources use canonical routes and expose a real contact action', () => {
  const navigationConfig = read('src/config/navigation.ts');
  const projectsIndexSource = read('src/pages/projects/index.astro');
  const projectDetailSource = read('src/components/projects/ProjectDetailPage.astro');
  const resumeSource = read('src/pages/resume.astro');
  const resumeHelperSource = read('src/lib/content/get-resume.ts');
  const contactSource = read('src/pages/contact.astro');
  const contactConfig = read('src/config/contact.ts');

  assert.match(navigationConfig, /export const launchRoutes = /, 'canonical launch routes should be available for cross-route handoffs');
  assert.match(projectsIndexSource, /from '\.\.\/\.\.\/config\/navigation'/, 'projects index should import canonical routes');
  assert.match(projectDetailSource, /from '\.\.\/\.\.\/config\/navigation'/, 'project detail should import canonical routes');
  assert.match(resumeSource, /from '\.\.\/lib\/content\/get-resume'/, 'resume page should stay thin and delegate to the canonical helper');
  assert.match(resumeHelperSource, /from '\.\.\/\.\.\/config\/navigation'/, 'resume helper should import canonical routes for cross-route handoffs');
  assert.match(contactSource, /from '\.\.\/config\/navigation'/, 'contact page should import canonical routes');
  assert.match(contactConfig, /mailto:|primaryContactHref/, 'contact config should expose a real lightweight contact action');
  assert.match(contactSource, /Email Chris/, 'contact page should expose a clear outreach action');
  assert.match(contactSource, /Review the resume again/, 'contact page should preserve orientation back into the evaluation journey');
});

test('story 3.2: built routes expose a cohesive profile to proof to resume to contact journey', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const homeHtml = read('dist/index.html');
  const projectsHtml = read('dist/projects/index.html');
  const detailHtml = read('dist/projects/portfolio-refresh/index.html');
  const resumeHtml = read('dist/resume/index.html');
  const contactHtml = read('dist/contact/index.html');

  assert.match(homeHtml, /href="\/projects\/"[^>]*>Review project proof</, 'homepage should hand evaluators into the projects route');
  assert.match(homeHtml, /Continue into project proof/, 'homepage should explain why projects are the next stop');

  assert.match(projectsHtml, /href="\/resume\/"[^>]*>Continue to the resume</, 'projects index should offer an explicit onward resume handoff');
  assert.match(projectsHtml, /formal experience|resume review/i, 'projects index should explain the value of the resume stage');

  assert.match(detailHtml, /href="\/resume\/"[^>]*>Continue to resume</, 'project detail should preserve the resume handoff');
  assert.match(detailHtml, /latest resume|formal experience|evaluation path/i, 'project detail should frame the resume handoff as part of the same journey');

  assert.match(resumeHtml, /href="\/contact\/"[^>]*>Continue to contact</, 'resume page should preserve the final contact handoff');
  assert.match(resumeHtml, /projects|proof/i, 'resume page should preserve orientation back to the proof stage');

  assert.match(contactHtml, /proof|resume|evaluation/i, 'contact page should still feel like the end of the same evaluation journey');
  assert.match(contactHtml, /href="mailto:chrisfahey1010@gmail\.com"[^>]*>Email Chris</, 'contact page should expose a real direct outreach action');
  assert.match(contactHtml, /Review the resume again/, 'contact page should preserve a clear path back to supporting evaluation context');
});
