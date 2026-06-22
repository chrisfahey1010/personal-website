import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();
export const buildEnv = { ...process.env, NODE_OPTIONS: '' };
export const read = (target) => fs.readFileSync(path.join(root, target), 'utf8');
export const exists = (target) => fs.existsSync(path.join(root, target));
export const build = () => execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe', env: buildEnv });
export const runCheck = () => execFileSync('npm', ['run', 'check'], { cwd: root, stdio: 'pipe', env: buildEnv });
export const stripHead = (html) => html.replace(/<head>[\s\S]*?<\/head>/i, '');
export const publicPageFiles = ['dist/index.html', 'dist/projects/index.html', 'dist/resume/index.html', 'dist/contact/index.html'];
export const projectFileNames = ['castaway.md', 'livenapalm-site.md', 'ebook-rag.md', 'lakemapper.md', 'gt-anywhere.md'];
export const projectTitles = ['Castaway', 'LiveNapalm Site', 'ebook-rag', 'LakeMapper', 'gt-anywhere'];
export const allowedStatuses = ['Deployed', 'In-Development', 'On-Hold', 'Planning'];
export const bannedPublicCopy = /Warm Editorial Portfolio|Professional Signal|calm, credible web experiences|built to show fit quickly|proof section|evaluation path|delivery choices, tradeoffs, and outcomes|Choose the next path|contact stays available|normal detail page|Personal Website Refresh|Team Dashboard Modernization/i;

export const countH1 = (html) => (html.match(/<h1\b[^>]*>/g) ?? []).length;
export const frontmatterValue = (source, key) => source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^['"]|['"]$/g, '').trim();
