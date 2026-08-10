import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const distRoot = path.join(repositoryRoot, 'dist');

const requiredSources = [
  'https://www.buddhajewelry.com/products/anais-clicker-with-blue-sapphire-lab-grown.json',
  'https://www.buddhajewelry.com/agents.md',
  'https://safepiercing.org/about/',
  'https://safepiercing.org/about/corporate-sponsors/',
];

function getTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
}

function getPairedTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi')) ?? [];
}

function getAttribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function stripTags(value) {
  return value.replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function assertDirectiveMeta(html, name) {
  const tag = getTags(html, 'meta').find(
    (candidate) => getAttribute(candidate, 'name')?.toLowerCase() === name,
  );
  assert.ok(tag, `The Buddha route must include a ${name} directive.`);
  const directives = new Set(
    (getAttribute(tag, 'content') ?? '')
      .toLowerCase()
      .split(',')
      .map((directive) => directive.trim())
      .filter(Boolean),
  );
  assert.deepEqual(
    directives,
    new Set(['noindex', 'nofollow', 'noarchive']),
    `${name} must contain exactly noindex, nofollow, and noarchive.`,
  );
}

function assertMetadata(html) {
  const htmlTag = getTags(html, 'html')[0];
  assert.match(getAttribute(htmlTag ?? '', 'lang') ?? '', /^en(?:-|$)/i);
  assert.equal(getPairedTags(html, 'title').length, 1);
  assert.match(getPairedTags(html, 'title')[0], /Buddha Decision Desk/i);
  assertDirectiveMeta(html, 'robots');
  assertDirectiveMeta(html, 'googlebot');

  const canonical = getTags(html, 'link').find((tag) =>
    (getAttribute(tag, 'rel') ?? '').toLowerCase().split(/\s+/).includes('canonical'),
  );
  assert.equal(
    getAttribute(canonical ?? '', 'href'),
    'https://www.fahey.vip/buddha/',
    'The canonical URL must remain the production /buddha/ route.',
  );
}

function tagsWithAttribute(html, tagNames, attribute) {
  return tagNames.flatMap((tagName) => getTags(html, tagName)).filter((tag) =>
    new RegExp(`\\b${attribute}(?:\\s*=|[\\s>])`, 'i').test(tag),
  );
}

function assertDashboardStructure(html) {
  const main = tagsWithAttribute(html, ['main'], 'data-dashboard-shell');
  assert.equal(main.length, 1, 'The route must render one desktop dashboard shell.');
  assert.equal(getAttribute(main[0], 'id'), 'main-content');

  const h1s = getPairedTags(html, 'h1');
  assert.equal(h1s.length, 1);
  assert.match(h1s[0], /Buddha Decision Desk/i);

  assert.equal(
    tagsWithAttribute(html, ['aside', 'div'], 'data-demo-disclosure').length,
    1,
    'Use one compact always-visible demo disclosure.',
  );
  assert.match(html, /Public catalog facts/i);
  assert.match(html, /synthetic operating data/i);
  assert.match(html, /Sales pace/i);
  assert.match(html, /synthetic MTD plan/i);

  assert.equal(
    tagsWithAttribute(html, ['section', 'div'], 'data-summary-strip').length,
    1,
    'The desktop dashboard requires one summary strip.',
  );
  assert.equal(
    tagsWithAttribute(html, ['article', 'div'], 'data-summary-metric').length,
    4,
    'The summary strip must expose exactly four decision metrics.',
  );
  assert.equal(
    tagsWithAttribute(html, ['strong'], 'data-summary-coverage-gap').length,
    1,
    'The active scenario coverage KPI must expose a browser update hook.',
  );

  assert.equal(tagsWithAttribute(html, ['section'], 'data-action-queue').length, 1);
  const decisionRows = tagsWithAttribute(html, ['button'], 'data-decision-row');
  assert.equal(decisionRows.length, 3, 'The action queue must render exactly three compact rows.');
  assert.equal(
    decisionRows.filter((row) => getAttribute(row, 'aria-pressed') === 'true').length,
    1,
    'Exactly one action row must be selected initially.',
  );

  for (const hook of [
    'data-selected-decision',
    'data-forecast-panel',
    'data-support-panel',
    'data-about-dialog',
  ]) {
    assert.equal(
      tagsWithAttribute(html, ['section', 'aside', 'dialog'], hook).length,
      1,
      `The dashboard requires one ${hook} surface.`,
    );
  }

  const supportPanels = getTags(html, 'section').filter((section) =>
    (getAttribute(section, 'class') ?? '').split(/\s+/).includes('support-panel'),
  );
  assert.equal(supportPanels.length, 2, 'Studio and Market must render as two distinct panels.');
  assert.deepEqual(
    supportPanels.map((panel) => getAttribute(panel, 'aria-labelledby')),
    ['studio-title', 'market-title'],
  );
  assert.equal(
    tagsWithAttribute(html, ['button'], 'data-support-tab').length,
    0,
    'Studio and Market must remain simultaneously visible without tab controls.',
  );
  assert.equal(tagsWithAttribute(html, ['article'], 'data-support-view').length, 0);
  assert.equal(
    tagsWithAttribute(html, ['article'], 'data-studio-opportunity').length,
    2,
    'The Studio Opportunities panel must render two entries.',
  );
  assert.equal(
    tagsWithAttribute(html, ['article'], 'data-market-signal').length,
    2,
    'The Market Signals panel must render two entries.',
  );

  const demandPanels = tagsWithAttribute(html, ['section'], 'data-demand-panel');
  assert.deepEqual(
    demandPanels.map((panel) => getAttribute(panel, 'data-demand-panel')),
    ['gemstone', 'metal'],
    'Gemstone and metal demand must render as two adjacent panel surfaces.',
  );

  for (const kind of ['gemstone', 'metal']) {
    assert.equal(
      tagsWithAttribute(html, ['div'], 'data-demand-axis')
        .filter((axis) => getAttribute(axis, 'data-demand-axis') === kind).length,
      1,
      `${kind} demand requires one explicit weight axis.`,
    );
    assert.equal(
      tagsWithAttribute(html, ['div'], 'data-demand-row')
        .filter((row) => getAttribute(row, 'data-demand-row') === kind).length,
      4,
      `${kind} demand requires four comparable volume rows.`,
    );
    assert.equal(
      tagsWithAttribute(html, ['span'], 'data-demand-volume')
        .filter((volume) => getAttribute(volume, 'data-demand-volume') === kind).length,
      4,
    );
    assert.equal(
      tagsWithAttribute(html, ['strong'], 'data-demand-change')
        .filter((change) => getAttribute(change, 'data-demand-change') === kind).length,
      4,
    );
  }

  assert.match(html, /Carats sold/i);
  assert.match(html, /Grams sold/i);
  assert.match(html, /Change vs 30 days ago/i);
  assert.match(html, /ct = carats/i);
  assert.match(html, /g = grams/i);
  assert.match(html, /not Buddha or market data/i);
  assert.doesNotMatch(html, /Relative demand index/i);

  const visiblePanelKickers = getPairedTags(html, 'p')
    .filter((tag) => (getAttribute(tag, 'class') ?? '').split(/\s+/).includes('panel-kicker'))
    .map(stripTags);
  for (const removedKicker of ['Today', 'Selected decision', 'Illustrative outlook', 'Signals']) {
    assert.ok(
      !visiblePanelKickers.includes(removedKicker),
      `Remove the ${removedKicker} secondary panel heading.`,
    );
  }

  assert.equal(
    tagsWithAttribute(html, ['button'], 'data-selected-action').length,
    1,
    'The selected decision requires one explicit demo review action.',
  );
  assert.equal(
    tagsWithAttribute(html, ['p'], 'data-action-feedback').length,
    1,
    'The review action requires an accessible status message.',
  );
  assert.equal(
    tagsWithAttribute(html, ['p'], 'data-decision-announcement').length,
    1,
    'Dynamic decision changes require one atomic screen-reader announcement.',
  );

  const aboutDialog = tagsWithAttribute(html, ['dialog'], 'data-about-dialog')[0];
  assert.equal(getAttribute(aboutDialog, 'open'), null, 'The methodology dialog must be closed initially.');

  const scenarioButtons = getPairedTags(html, 'button').filter((button) =>
    ['baseline', 'longer-lead-time', 'demand-increase'].includes(
      getAttribute(button, 'data-scenario'),
    ),
  );
  assert.equal(scenarioButtons.length, 3, 'The selected panel requires three scenario controls.');
  assert.equal(
    scenarioButtons.filter((button) => getAttribute(button, 'aria-pressed') === 'true').length,
    1,
  );

  for (const label of ['PUBLIC', 'SYNTHETIC DEMO', 'DERIVED', 'MISSING']) {
    assert.ok(html.includes(label), `The about/evidence surfaces must preserve the ${label} legend.`);
  }

  assert.doesNotMatch(html, /\bid=["']what-i-heard["']/i);
  assert.doesNotMatch(html, /\bid=["']pilot["']/i);
  assert.doesNotMatch(html, /buddha-concept-header/i);
  assert.equal(getTags(html, 'footer').length, 0, 'The dashboard shell must not end in a landing-page footer.');

  const withoutDialog = html.replace(/<dialog\b[\s\S]*?<\/dialog>/gi, ' ');
  const visibleWordCount = stripTags(withoutDialog).split(/\s+/).filter(Boolean).length;
  assert.ok(
    visibleWordCount <= 450,
    `The default dashboard view must stay concise (found ${visibleWordCount} words; max 450).`,
  );
}

function assertTrustAndSources(html) {
  for (const pattern of [
    /inventory[_-]?quantity/i,
    /old[_-]?inventory[_-]?quantity/i,
    /\bNetSuite\b/i,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  ]) {
    assert.doesNotMatch(html, pattern, `The built dashboard contains forbidden content ${pattern}.`);
  }

  const anchors = getPairedTags(html, 'a');
  for (const source of requiredSources) {
    const anchor = anchors.find((candidate) => getAttribute(candidate, 'href') === source);
    assert.ok(anchor, `The methodology dialog must cite ${source}.`);
    assert.match(anchor, /\bdata-source-link(?:\s*=|[\s>])/i);
  }

  assert.match(html, /APP[\s\S]{0,500}not (?:a )?direct competitor/i);
  assert.match(html, /AI-assisted draft\s*[—-]\s*human verification required/i);
  assert.match(html, /Demo Studio North/i);
  assert.match(html, /Fictional/i);
}

function getActiveResources(html) {
  const references = [];
  for (const [tagName, attributes] of [
    ['script', ['src']],
    ['link', ['href']],
    ['img', ['src', 'srcset']],
  ]) {
    for (const tag of getTags(html, tagName)) {
      if (tagName === 'link') {
        const rel = new Set((getAttribute(tag, 'rel') ?? '').toLowerCase().split(/\s+/));
        if (![...rel].some((value) => ['stylesheet', 'modulepreload', 'preload'].includes(value))) continue;
      }
      for (const attribute of attributes) {
        const value = getAttribute(tag, attribute);
        if (value && !value.startsWith('data:')) references.push({ tagName, attribute, value });
      }
    }
  }
  return references;
}

async function assertRuntimeAndStyles(html) {
  const scripts = [];
  const styles = [];
  for (const reference of getActiveResources(html)) {
    assert.doesNotMatch(
      reference.value,
      /^(?:https?:)?\/\//i,
      `The dashboard must not load external runtime resource ${reference.value}.`,
    );
    const clean = reference.value.split(/[?#]/, 1)[0];
    const absolute = clean.startsWith('/')
      ? path.resolve(distRoot, `.${clean}`)
      : path.resolve(distRoot, 'buddha', clean);
    const content = await readFile(absolute, 'utf8');
    if (reference.tagName === 'script') scripts.push(content);
    if (reference.tagName === 'link' && /\.css$/i.test(clean)) styles.push(content);
  }

  const executable = [
    ...getPairedTags(html, 'script')
      .filter((script) => !getAttribute(script, 'src'))
      .map((script) => script.replace(/^<script\b[^>]*>|<\/script>$/gi, '')),
    ...scripts,
  ].join('\n');
  const stylesheet = [
    ...getPairedTags(html, 'style').map((style) => style.replace(/^<style\b[^>]*>|<\/style>$/gi, '')),
    ...styles,
  ].join('\n');

  for (const pattern of [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\s*\(/,
    /\.innerHTML\b/,
  ]) {
    assert.doesNotMatch(executable, pattern);
  }
  assert.match(executable, /addEventListener\(["']click["']/);
  assert.match(executable, /aria-pressed/);
  assert.match(executable, /showModal/);
  assert.match(executable, /data-summary-coverage-gap/);
  assert.match(executable, /data-action-feedback/);

  assert.match(stylesheet, /height:\s*100dvh/i, 'The desktop shell must use the full dynamic viewport height.');
  assert.match(stylesheet, /overflow:\s*hidden/i, 'The desktop dashboard must prevent page-level scrolling.');
  assert.match(stylesheet, /--dashboard-display-scale:\s*1\.333333/i, 'Native 1440p requires a proportional presentation-density tier.');
  assert.match(stylesheet, /--dashboard-display-scale:\s*2(?:\D|$)/i, 'Native 4K requires a 2x presentation-density tier.');
  assert.match(stylesheet, /transform:\s*scale\(var\(--dashboard-display-scale\)\)/i, 'The resolution tiers must scale the dashboard composition, not stretch its empty grid space.');
  assert.match(stylesheet, /@media\s*\(min-width:\s*2300px\)\s*and\s*\(min-height:\s*1200px\)/i, 'The 1440p tier must require both viewport dimensions.');
  assert.match(stylesheet, /@media\s*\(min-width:\s*3400px\)\s*and\s*\(min-height:\s*1800px\)/i, 'The native 4K tier must require both viewport dimensions.');
  assert.match(stylesheet, /:focus-visible/i);
  assert.match(stylesheet, /prefers-reduced-motion\s*:\s*reduce/i);
  assert.doesNotMatch(stylesheet, /radial-gradient|linear-gradient/i, 'The dashboard must use flat professional surfaces.');
}

function assertHomeDoesNotExposeRoute(homeHtml) {
  for (const anchor of getTags(homeHtml, 'a')) {
    const href = getAttribute(anchor, 'href');
    if (!href) continue;
    const resolved = new URL(href, 'https://www.fahey.vip/');
    assert.ok(
      !(['fahey.vip', 'www.fahey.vip'].includes(resolved.hostname) && /^\/buddha(?:\/|$)/i.test(resolved.pathname)),
      'The portfolio home page must not link to /buddha.',
    );
  }
}

function getHeaderBlock(headers, route) {
  const lines = headers.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === route);
  if (start === -1) return null;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index].trim() && !/^\s/.test(lines[index])) break;
    block.push(lines[index]);
  }
  return block.join('\n');
}

function assertHeaders(headers) {
  for (const route of ['/buddha', '/buddha/', '/buddha/*']) {
    const block = getHeaderBlock(headers, route);
    assert.ok(block, `dist/_headers must include ${route}.`);
    assert.match(block, /X-Robots-Tag:\s*noindex,\s*nofollow,\s*noarchive/i);
  }
}

async function readArtifact(relativePath) {
  try {
    return await readFile(path.join(repositoryRoot, relativePath), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(`Missing ${relativePath}. Run npm run build first.`);
    }
    throw error;
  }
}

async function verify() {
  const routeHtml = await readArtifact('dist/buddha/index.html');
  const homeHtml = await readArtifact('dist/index.html');
  const headers = await readArtifact('dist/_headers');

  assertMetadata(routeHtml);
  assertDashboardStructure(routeHtml);
  assertTrustAndSources(routeHtml);
  await assertRuntimeAndStyles(routeHtml);
  assertHomeDoesNotExposeRoute(homeHtml);
  assertHeaders(headers);
  console.log('Buddha dashboard build verification passed.');
}

try {
  await verify();
} catch (error) {
  console.error(`Buddha dashboard build verification failed: ${error.message}`);
  process.exitCode = 1;
}
