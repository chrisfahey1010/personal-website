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
  assert.match(workflow, /node-version:\s*20\.3\.0/, 'CI should pin a supported Astro 5 Node version');
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
  assert.doesNotMatch(packageJson.scripts.test, /\*\*/, 'test script should not rely on an unexpanded recursive glob in CI');
});

test('story 1.2 task 2: deploy workflow stays gated behind successful CI on main', () => {
  assert.equal(exists('.github/workflows/deploy.yml'), true, 'deploy workflow should exist');

  const workflow = read('.github/workflows/deploy.yml');

  assert.match(workflow, /workflow_run:/, 'deploy should be triggered from CI completion');
  assert.match(workflow, /workflows:\s*\[[^\]]*CI[^\]]*\]/, 'deploy should depend on the CI workflow');
  assert.match(workflow, /branches:\s*[\s\S]*-\s*main/, 'deploy should be limited to the protected branch');
  assert.match(workflow, /github\.event\.workflow_run\.conclusion\s*==\s*'success'/, 'deploy should require successful CI');
  assert.match(workflow, /github\.event\.workflow_run\.event\s*==\s*'push'/, 'deploy should only follow successful push-based CI runs');
  assert.match(workflow, /ref:\s*\$\{\{\s*github\.event\.workflow_run\.head_sha\s*\}\}/, 'deploy should check out the exact CI-validated commit');
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/, 'deploy should pin checkout to an immutable commit SHA');
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/, 'deploy should pin setup-node to an immutable commit SHA');
  assert.match(workflow, /aws-actions\/configure-aws-credentials@[0-9a-f]{40}/, 'deploy should pin AWS credentials action to an immutable commit SHA');
  assert.match(workflow, /permissions:\s*[\s\S]*contents:\s*read/, 'deploy should only read repository contents');
  assert.match(workflow, /permissions:\s*[\s\S]*id-token:\s*write/, 'deploy should request OIDC token access');
  assert.match(workflow, /concurrency:\s*[\s\S]*group:/, 'deploy should protect against overlapping runs');
  assert.match(workflow, /npm ci/, 'deploy should install dependencies');
  assert.match(workflow, /npm run build/, 'deploy should build the site');
  assert.match(workflow, /aws s3 sync dist\/ s3:\/\//, 'deploy should sync dist to S3');
  assert.match(workflow, /aws cloudfront create-invalidation/, 'deploy should invalidate CloudFront');
  assert.match(workflow, /--paths\s+"\/\*"/, 'deploy should invalidate all baseline HTML routes until route-aware invalidation exists');
  assert.doesNotMatch(workflow, /s3-website[.-]/, 'deploy must not use the public S3 website endpoint');
});

test('story 1.2 task 3: deployment responsibilities stay out of application env files', () => {
  assert.equal(exists('.env.example'), true, '.env.example should exist');
  assert.equal(exists('infrastructure/cloudfront/README.md'), true, 'CloudFront note should exist');

  const envExample = read('.env.example');
  const infraReadme = read('infrastructure/README.md');
  const cloudfrontReadme = read('infrastructure/cloudfront/README.md');

  assert.doesNotMatch(envExample, /AWS_REGION|AWS_ROLE_TO_ASSUME|AWS_S3_BUCKET|AWS_CLOUDFRONT_DISTRIBUTION_ID/, '.env.example must not include deployment-only AWS inputs');
  assert.doesNotMatch(envExample, /AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY/, '.env.example must not include AWS secret keys');
  assert.match(infraReadme, /private S3 origin behind CloudFront/i, 'infrastructure README should describe private S3 behind CloudFront');
  assert.match(infraReadme, /restricted origin access/i, 'infrastructure README should require restricted origin access');
  assert.match(infraReadme, /HTTPS|certificate/i, 'infrastructure README should describe HTTPS certificate ownership');
  assert.match(infraReadme, /secure headers/i, 'infrastructure README should describe header ownership');
  assert.match(infraReadme, /AWS_REGION|AWS_ROLE_TO_ASSUME|AWS_S3_BUCKET|AWS_CLOUDFRONT_DISTRIBUTION_ID/, 'infrastructure README should document canonical deployment inputs');
  assert.match(infraReadme, /versioned asset/i, 'infrastructure README should prefer versioned assets');
  assert.match(infraReadme, /protected-branch rules|branch protection/i, 'infrastructure README should document branch protection ownership');
  assert.match(infraReadme, /exact commit SHA|exact commit/i, 'infrastructure README should document validated-commit deployment');
  assert.match(infraReadme, /immutable commit SHAs?|commit SHAs/i, 'infrastructure README should document immutable action pinning');
  assert.match(infraReadme, /\`\/\*\`|\/\*/i, 'infrastructure README should document the baseline wildcard invalidation');
  assert.match(cloudfrontReadme, /cache behavior/i, 'CloudFront note should describe cache behavior');
  assert.match(cloudfrontReadme, /immutable asset/i, 'CloudFront note should describe immutable asset strategy');
  assert.match(cloudfrontReadme, /HTML invalidation/i, 'CloudFront note should describe HTML invalidation guidance');
  assert.match(cloudfrontReadme, /header policy/i, 'CloudFront note should describe header policy ownership');
});

test('story 1.2 task 4: verification guardrails protect the static-first deployment baseline', () => {
  const ciWorkflow = read('.github/workflows/ci.yml');
  const deployWorkflow = read('.github/workflows/deploy.yml');
  const envExample = read('.env.example');
  const inspectedFiles = [ciWorkflow, deployWorkflow, envExample, read('infrastructure/README.md'), read('infrastructure/cloudfront/README.md')].join('\n');

  assert.match(ciWorkflow, /npm ci/, 'CI must install with npm ci');
  assert.match(ciWorkflow, /npm run check/, 'CI must run Astro validation checks');
  assert.match(ciWorkflow, /npm test/, 'CI must run tests');
  assert.match(ciWorkflow, /npm run build/, 'CI must run the production build');
  assert.match(deployWorkflow, /workflow_run:/, 'deploy must remain gated behind CI completion');
  assert.match(deployWorkflow, /github\.event\.workflow_run\.conclusion\s*==\s*'success'/, 'deploy must require successful CI');
  assert.match(deployWorkflow, /github\.event\.workflow_run\.event\s*==\s*'push'/, 'deploy must only follow successful push-based CI runs');
  assert.match(deployWorkflow, /ref:\s*\$\{\{\s*github\.event\.workflow_run\.head_sha\s*\}\}/, 'deploy must publish the exact CI-validated commit');
  assert.match(ciWorkflow, /actions\/checkout@[0-9a-f]{40}/, 'CI must pin checkout to an immutable commit SHA');
  assert.match(ciWorkflow, /actions\/setup-node@[0-9a-f]{40}/, 'CI must pin setup-node to an immutable commit SHA');
  assert.match(deployWorkflow, /aws-actions\/configure-aws-credentials@[0-9a-f]{40}/, 'deploy must pin AWS credentials action to an immutable commit SHA');
  assert.match(deployWorkflow, /--paths\s+"\/\*"/, 'deploy must invalidate the full baseline route set');
  assert.match(deployWorkflow, /Missing required GitHub variable: AWS_REGION/, 'deploy should fail clearly when AWS_REGION is missing');
  assert.match(deployWorkflow, /Missing required GitHub variable: AWS_ROLE_TO_ASSUME/, 'deploy should fail clearly when AWS_ROLE_TO_ASSUME is missing');
  assert.match(deployWorkflow, /Missing required GitHub variable: AWS_S3_BUCKET/, 'deploy should fail clearly when AWS_S3_BUCKET is missing');
  assert.match(deployWorkflow, /Missing required GitHub variable: AWS_CLOUDFRONT_DISTRIBUTION_ID/, 'deploy should fail clearly when AWS_CLOUDFRONT_DISTRIBUTION_ID is missing');
  assert.doesNotMatch(inspectedFiles, /AKIA[0-9A-Z]{16}/, 'committed AWS access key ids must not appear in tracked baseline files');
  assert.doesNotMatch(inspectedFiles, /aws_secret_access_key|AWS_SECRET_ACCESS_KEY/i, 'committed AWS secret key references must not appear in baseline files');
  assert.equal(exists('src/pages/api'), false, 'runtime API scaffolding should remain out of scope');
  assert.equal(exists('src/db'), false, 'database scaffolding should remain out of scope');
  assert.equal(exists('src/auth'), false, 'authentication scaffolding should remain out of scope');
});

test('story 1.2 task 5: check and build scripts succeed in a GitHub-like CI environment', () => {
  execFileSync('npm', ['run', 'check'], { cwd: root, stdio: 'pipe', env: ciEnv });
  fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: ciEnv });

  assert.equal(exists('dist/index.html'), true, 'CI-like validation should produce a deployable homepage');
});

test('story 1.2 task 6: production build output preserves the homepage contract', () => {
  const builtIndex = read('dist/index.html');

  assert.match(builtIndex, /<!doctype html>/i, 'built output should remain a valid HTML document');
  assert.match(builtIndex, /<title>Chris Fahey<\/title>/, 'homepage title should survive the production build');
  assert.match(builtIndex, /<h1[^>]*>Chris Fahey<\/h1>/, 'homepage heading should survive the production build');
  assert.match(builtIndex, /Baseline Astro foundation for upcoming story implementation\./, 'homepage body copy should survive the production build');
  assert.doesNotMatch(builtIndex, /Welcome to Astro/i, 'starter demo copy should not reappear in production output');
});
