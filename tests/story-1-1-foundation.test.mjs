import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const exists = (target) => fs.existsSync(path.join(root, target));
const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
const ciEnv = {
  ...process.env,
  CI: 'true',
  GITHUB_ACTIONS: 'true',
  GITHUB_REF: 'refs/heads/main',
  GITHUB_SHA: '0123456789abcdef0123456789abcdef01234567',
};

test('story 1.1 task 1: Astro starter files exist in repo root', () => {
  assert.equal(exists('personal-website'), false, 'must not create a nested app directory');
  assert.equal(exists('package.json'), true, 'package.json should exist in the repo root');
  assert.equal(exists('astro.config.mjs'), true, 'astro.config.mjs should exist in the repo root');
  assert.equal(exists('src/pages/index.astro'), true, 'src/pages/index.astro should exist');
});

test('story 1.1 task 2: launch dependencies and strict config are present', async () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const astroConfig = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
  const tsconfig = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8'));
  const baseLayout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  const contentConfig = fs.readFileSync(path.join(root, 'src/content/config.ts'), 'utf8');

  assert.equal(packageJson.dependencies.astro.startsWith('^5.'), true, 'Astro 5 should be configured');
  assert.equal(packageJson.dependencies.tailwindcss.startsWith('^4.'), true, 'Tailwind 4 should be configured');
  assert.equal(packageJson.dependencies['@tailwindcss/vite'].startsWith('^4.'), true, '@tailwindcss/vite should be configured');
  assert.equal(packageJson.dependencies.zod.startsWith('^4.'), true, 'Zod 4 should be configured');
  assert.equal(exists('package-lock.json'), true, 'dependencies should be installed and locked');
  assert.match(astroConfig, /@tailwindcss\/vite/, 'Astro config should use Tailwind via Vite');
  assert.equal(tsconfig.compilerOptions.strict, true, 'TypeScript strict mode should remain enabled');
  assert.match(baseLayout, /\.\.\/styles\/global\.css/, 'global stylesheet should be imported once from the shared app layout');
  assert.match(contentConfig, /defineCollection/, 'content collections should be prepared with Astro collection helpers');
  assert.match(contentConfig, /\bz\./, 'content collections should be prepared with Zod-backed schemas');
});

test('story 1.1 task 3: starter structure exists without premature features', () => {
  const requiredDirs = [
    'src/pages',
    'src/layouts',
    'src/components',
    'src/content',
    'src/config',
    'src/lib',
    'src/styles',
    'src/utils',
    'src/types',
    'public',
    'tests',
    'infrastructure',
  ];

  for (const dir of requiredDirs) {
    assert.equal(exists(dir), true, `${dir} should exist`);
  }

  assert.equal(exists('src/stores'), false, 'global client state should not be introduced in this story');
  assert.equal(exists('src/db'), false, 'database scaffolding should not be introduced in this story');
});

test('story 1.1 task 4: launch guardrails are encoded in baseline files', () => {
  const astroConfig = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');

  assert.match(astroConfig, /output:\s*'static'/, 'Astro output should stay static-first');
  assert.equal(exists('src/content.config.ts'), true, 'content collections config should be reserved');
  assert.equal(exists('src/stores'), false, 'global client state should not be introduced');
  assert.equal(exists('src/db'), false, 'database scaffolding should not be introduced');
  assert.equal(exists('src/auth'), false, 'authentication scaffolding should not be introduced');
});

test('story 1.1 task 5: baseline remains small and buildable', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  assert.equal(typeof packageJson.scripts.dev, 'string', 'dev script should exist');
  assert.equal(typeof packageJson.scripts.build, 'string', 'build script should exist');
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });
  assert.equal(exists('dist/index.html'), true, 'production build output should be generated');
  assert.equal(exists('src/components/Welcome.astro'), false, 'starter demo files should not remain');
});

test('story 1.2 task 1: CI workflow validates install, test, and build on push and pull request', () => {
  assert.equal(exists('.github/workflows/ci.yml'), true, 'CI workflow should exist');

  const workflow = read('.github/workflows/ci.yml');
  const packageJson = JSON.parse(read('package.json'));

  assert.match(workflow, /on:\s*[\s\S]*push:/, 'CI should run on push');
  assert.match(workflow, /on:\s*[\s\S]*pull_request:/, 'CI should run on pull requests');
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/, 'CI should pin checkout to an immutable commit SHA');
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/, 'CI should pin setup-node to an immutable commit SHA');
  assert.match(workflow, /node-version:\s*(20\.3\.0|22\.\d+\.\d+)/, 'CI should pin a supported Astro 5 Node version');
  assert.match(workflow, /npm ci/, 'CI should install with npm ci');
  assert.match(workflow, /npm run check/, 'CI should run baseline validation checks');
  assert.match(workflow, /npm test/, 'CI should run tests');
  assert.match(workflow, /npm run build/, 'CI should run the production build');
  assert.match(workflow, /permissions:\s*[\s\S]*contents:\s*read/, 'CI should keep permissions minimal');
  assert.doesNotMatch(workflow, /AWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY)|configure-aws-credentials|id-token:\s*write/, 'CI-only workflow should not include deploy credentials');
  assert.equal(typeof packageJson.scripts.check, 'string', 'package.json should expose a validation script');
  assert.equal(typeof packageJson.scripts.test, 'string', 'package.json should expose a test script');
  assert.match(packageJson.scripts.check, /astro sync/, 'check script should refresh Astro generated types');
  assert.match(packageJson.scripts.check, /tsc --noEmit/, 'check script should run TypeScript validation without emitting files');
  assert.equal(exists('tests/run-node-tests.mjs'), true, 'test runner shim should exist for CI-compatible execution');
  assert.match(packageJson.scripts.test, /tests\/run-node-tests\.mjs/, 'test script should delegate to the repo test runner shim');
  assert.doesNotMatch(packageJson.scripts.test, /--test-concurrency\b/, 'test script should stay compatible with the CI Node version');
  assert.doesNotMatch(packageJson.scripts.test, /\*\*/, 'test script should not rely on an unexpanded recursive glob in CI');

  const testRunner = read('tests/run-node-tests.mjs');

  assert.match(testRunner, /withFileTypes:\s*true/, 'test runner should inspect test directories recursively');
  assert.match(testRunner, /entry\.isDirectory\(\)/, 'test runner should descend into nested test folders');
});

test('story 1.2 task 2: deployment baseline stays simple and Cloudflare-oriented', () => {
  assert.equal(exists('.github/workflows/deploy.yml'), false, 'deploy workflow should not exist when Cloudflare Pages Git deployment is the baseline');
  assert.equal(exists('infrastructure/cloudflare/README.md'), true, 'Cloudflare deployment note should exist');

  const cloudflareReadme = read('infrastructure/cloudflare/README.md');

  assert.match(cloudflareReadme, /Cloudflare Pages/i, 'deployment note should identify Cloudflare Pages as the host');
  assert.match(cloudflareReadme, /native Git integration|Git integration/i, 'deployment note should prefer Cloudflare Git deployment for MVP');
  assert.match(cloudflareReadme, /fahey\.vip/i, 'deployment note should cover the production domain');
  assert.doesNotMatch(cloudflareReadme, /Amazon S3|CloudFront/i, 'deployment note should not preserve AWS hosting assumptions');
});

test('story 1.2 task 3: deployment responsibilities stay out of application env files', () => {
  assert.equal(exists('.env.example'), true, '.env.example should exist');
  assert.equal(exists('infrastructure/cloudflare/README.md'), true, 'Cloudflare note should exist');

  const envExample = read('.env.example');
  const infraReadme = read('infrastructure/README.md');
  const cloudflareReadme = read('infrastructure/cloudflare/README.md');

  assert.doesNotMatch(envExample, /AWS_REGION|AWS_ROLE_TO_ASSUME|AWS_S3_BUCKET|AWS_CLOUDFRONT_DISTRIBUTION_ID|CLOUDFLARE_API_TOKEN/i, '.env.example must not include deployment-only hosting inputs');
  assert.doesNotMatch(envExample, /AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY/i, '.env.example must not include AWS secret keys');
  assert.match(infraReadme, /Cloudflare Pages/i, 'infrastructure README should describe Cloudflare Pages hosting');
  assert.match(infraReadme, /fahey\.vip/i, 'infrastructure README should cover the production domain');
  assert.match(infraReadme, /HTTPS/i, 'infrastructure README should describe HTTPS ownership');
  assert.match(infraReadme, /secure-header|secure header/i, 'infrastructure README should describe header ownership');
  assert.match(infraReadme, /repository wherever practical/i, 'infrastructure README should preserve repository-hosted content');
  assert.match(infraReadme, /versioned asset/i, 'infrastructure README should prefer versioned assets');
  assert.match(infraReadme, /protected-branch rules|branch protection/i, 'infrastructure README should document branch protection ownership');
  assert.match(infraReadme, /exact commit SHA|exact commit/i, 'infrastructure README should document validated-commit deployment for any future custom workflow');
  assert.match(infraReadme, /immutable commit SHAs?|commit SHAs/i, 'infrastructure README should document immutable action pinning');
  assert.match(cloudflareReadme, /Cloudflare Pages/i, 'Cloudflare note should describe the hosting target');
  assert.match(cloudflareReadme, /preview deployment/i, 'Cloudflare note should describe preview deployment behavior');
  assert.match(cloudflareReadme, /repository/i, 'Cloudflare note should describe repository-hosted content ownership');
  assert.match(cloudflareReadme, /Workers|Functions/i, 'Cloudflare note should document that dynamic features remain optional');
});

test('story 1.2 task 4: verification guardrails protect the static-first deployment baseline', () => {
  const ciWorkflow = read('.github/workflows/ci.yml');
  const envExample = read('.env.example');
  const cloudflareReadme = read('infrastructure/cloudflare/README.md');
  const inspectedFiles = [ciWorkflow, envExample, read('infrastructure/README.md'), cloudflareReadme].join('\n');

  assert.match(ciWorkflow, /npm ci/, 'CI must install with npm ci');
  assert.match(ciWorkflow, /npm run check/, 'CI must run Astro validation checks');
  assert.match(ciWorkflow, /npm test/, 'CI must run tests');
  assert.match(ciWorkflow, /npm run build/, 'CI must run the production build');
  assert.match(ciWorkflow, /actions\/checkout@[0-9a-f]{40}/, 'CI must pin checkout to an immutable commit SHA');
  assert.match(ciWorkflow, /actions\/setup-node@[0-9a-f]{40}/, 'CI must pin setup-node to an immutable commit SHA');
  assert.equal(exists('.github/workflows/deploy.yml'), false, 'AWS deployment workflow should be absent under the Cloudflare Pages baseline');
  assert.match(cloudflareReadme, /Cloudflare Pages/i, 'deployment documentation must describe Cloudflare Pages');
  assert.match(cloudflareReadme, /Git integration|Git-connected/i, 'deployment documentation must prefer Git-connected deployment');
  assert.match(cloudflareReadme, /fahey\.vip/i, 'deployment documentation must cover the production domain');
  assert.doesNotMatch(inspectedFiles, /AKIA[0-9A-Z]{16}/, 'committed AWS access key ids must not appear in tracked baseline files');
  assert.doesNotMatch(inspectedFiles, /aws_secret_access_key|AWS_SECRET_ACCESS_KEY/i, 'committed AWS secret key references must not appear in baseline files');
  assert.doesNotMatch(inspectedFiles, /Amazon S3|CloudFront/i, 'tracked deployment baseline files should not preserve AWS hosting guidance');
  assert.equal(exists('src/pages/api'), false, 'runtime API scaffolding should remain out of scope');
  assert.equal(exists('src/db'), false, 'database scaffolding should remain out of scope');
  assert.equal(exists('src/auth'), false, 'authentication scaffolding should remain out of scope');
});

test('story 1.2 task 5: check and build scripts succeed in a GitHub-like CI environment', () => {
  execFileSync('npm', ['run', 'check'], { cwd: root, stdio: 'pipe', env: ciEnv });
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: ciEnv });

  assert.equal(exists('dist/index.html'), true, 'CI-like validation should produce a deployable homepage');
});

test('story 1.2 task 6: production build output preserves the homepage contract', () => {
  const builtIndex = read('dist/index.html');

  assert.match(builtIndex, /<!doctype html>/i, 'built output should remain a valid HTML document');
  assert.match(builtIndex, /<title>Chris Fahey \| Product-minded software engineer<\/title>/, 'homepage title should survive the production build');
  assert.match(builtIndex, /<h1[^>]*>Chris Fahey<\/h1>/, 'homepage heading should survive the production build');
  assert.match(builtIndex, /Product-minded software engineer/, 'homepage role or focus copy should survive the production build');
  assert.match(builtIndex, /Review projects/, 'homepage CTA should survive the production build');
  assert.doesNotMatch(builtIndex, /Welcome to Astro/i, 'starter demo copy should not reappear in production output');
  assert.doesNotMatch(builtIndex, /Baseline Astro foundation for upcoming story implementation\./, 'baseline placeholder copy should not reappear in production output');
});
