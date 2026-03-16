import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const exists = (target) => fs.existsSync(path.join(root, target));
const projectsDir = path.join(root, 'src/content/projects');
const buildEnv = { ...process.env, NODE_OPTIONS: '' };

const getFrontmatterValue = (source, field) => {
  const match = source.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));

  return match ? match[1].trim().replace(/^['\"]|['\"]$/g, '') : undefined;
};

const getProjectContentFiles = () => {
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  return fs
    .readdirSync(projectsDir)
    .filter((entry) => entry.endsWith('.md'))
    .sort();
};

test('story 2.2 task 1: project schema and authored entries support substantive proof fields', () => {
  const contentConfig = read('src/content/config.ts');

  assert.match(contentConfig, /overview:\s*nonEmptyString/, 'project schema should require an overview');
  assert.match(contentConfig, /problem:\s*nonEmptyString/, 'project schema should require a problem statement');
  assert.match(contentConfig, /role:\s*nonEmptyString/, 'project schema should require a role description');
  assert.match(contentConfig, /proofSections:\s*z\.array\((?:proofSectionSchema|z\.object\()/, 'project schema should define structured proof sections');
  assert.match(contentConfig, /externalArtifacts:\s*z\.array\((?:externalArtifactSchema|z\.object\()/, 'project schema should support labeled optional external artifacts');

  for (const fileName of getProjectContentFiles()) {
    const source = read(`src/content/projects/${fileName}`);

    assert.match(source, /^---[\s\S]*overview:/m, `${fileName} should define an overview`);
    assert.match(source, /^---[\s\S]*problem:/m, `${fileName} should define a problem statement`);
    assert.match(source, /^---[\s\S]*role:/m, `${fileName} should define a role description`);
    assert.match(source, /^---[\s\S]*proofSections:/m, `${fileName} should define proof sections`);
  }
});

test('story 2.2 task 2 and 3: detail route stays thin and delegates proof rendering', () => {
  const detailRoute = read('src/pages/projects/[slug].astro');
  const helperSource = read('src/lib/content/get-projects.ts');
  const detailComponent = read('src/components/projects/ProjectDetailPage.astro');

  assert.match(detailRoute, /getStaticPaths/, 'detail route should preserve static path generation');
  assert.match(detailRoute, /getProjectBySlug/, 'detail route should use the canonical project helper');
  assert.match(detailRoute, /ProjectDetailPage/, 'detail route should delegate proof rendering to a project component');
  assert.match(detailComponent, /from '\.\.\/\.\.\/config\/navigation'/, 'project detail handoff should use the canonical route config');
  assert.match(detailComponent, /launchRoutes\.resume/, 'project detail should keep the resume handoff tied to the canonical route');
  assert.match(helperSource, /overview:\s*entry\.data\.overview/, 'canonical helper should expose project overview copy');
  assert.match(helperSource, /problem:\s*entry\.data\.problem/, 'canonical helper should expose project problem framing');
  assert.match(helperSource, /role:\s*entry\.data\.role/, 'canonical helper should expose project role details');
  assert.match(helperSource, /proofSections/, 'canonical helper should expose proof sections');
  assert.match(helperSource, /externalArtifacts/, 'canonical helper should expose optional external artifacts');
  assert.doesNotMatch(detailRoute, /client:load|client:idle|client:visible|client:only/, 'detail route should stay static-first');
});

test('story 2.2 task 4 and 5: build output shows substantive proof and optional references', () => {
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });

  const detailFiles = getProjectContentFiles().map((fileName) => {
    const source = read(`src/content/projects/${fileName}`);
    const slug = getFrontmatterValue(source, 'slug') ?? fileName.replace(/\.md$/, '');

    return {
      fileName,
      slug,
      filePath: `dist/projects/${slug}/index.html`,
    };
  });

  for (const { fileName, filePath } of detailFiles) {
    assert.equal(exists(filePath), true, `${filePath} should exist in the production build`);

    const html = read(filePath);

    assert.match(html, /What this project is/i, `${fileName} should explain what the project is`);
    assert.match(html, /Problem framing/i, `${fileName} should explain the problem framing`);
    assert.match(html, /Role and contribution/i, `${fileName} should explain the role and contribution`);
    assert.match(html, /Proof sections|Proof in practice|Implementation evidence/i, `${fileName} should present proof-oriented sections`);
    assert.match(html, /Back to all projects/, `${fileName} should preserve onward navigation to the projects index`);
    assert.match(html, /Continue to resume/, `${fileName} should preserve onward navigation to the resume`);
    assert.match(html, /Start a conversation/, `${fileName} should preserve onward navigation to contact`);
    assert.match(html, /<a class="project-card-link" href="\/resume\/">Continue to resume<\/a>/, `${fileName} should make resume the primary onward action`);
    assert.match(html, /<a class="project-card-link project-card-link-secondary" href="\/projects\/">Back to all projects<\/a>/, `${fileName} should keep the projects index as a secondary backtrack option`);
    assert.match(html, />Continue to resume<\/a>[\s\S]*>Start a conversation<\/a>[\s\S]*>Back to all projects<\//, `${fileName} should present next-step actions in onward-first order`);
    assert.match(html, /Continue the evaluation path|formal experience|latest resume/i, `${fileName} should explain why the resume is the next evaluative step`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${fileName} should emit metadata`);
    assert.match(html, /<link rel="canonical" href="[^"]+"/, `${fileName} should emit a canonical link`);
    assert.doesNotMatch(html, /client:load|client:idle|client:visible|client:only/, `${fileName} should stay static-first`);
  }

  const portfolioHtml = read('dist/projects/portfolio-refresh/index.html');
  const dashboardHtml = read('dist/projects/team-dashboard-modernization/index.html');

  assert.match(portfolioHtml, /Optional references/i, 'portfolio page should label external references as optional when present');
  assert.doesNotMatch(dashboardHtml, /Optional references/i, 'pages without external artifacts should still feel complete without an optional references block');
});
