import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const exists = (target) => fs.existsSync(path.join(root, target));

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
