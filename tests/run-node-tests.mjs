import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const testsDir = path.join(root, 'tests');

const collectTestFiles = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectTestFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith('.test.mjs')) {
        return [path.relative(root, fullPath)];
      }

      return [];
    })
    .sort();

const testFiles = collectTestFiles(testsDir);

for (const testFile of testFiles) {
  const result = spawnSync(process.execPath, ['--test', testFile], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
