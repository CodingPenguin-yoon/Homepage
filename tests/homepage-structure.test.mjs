import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const buildRoot = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const origin = 'https://yoonman.page';
const routes = ['/', '/portfolio', '/resume', '/projects/heimdall', '/projects/gjallar', '/projects/klepaas'];
const projectOrder = ['heimdall', 'gjallar', 'klepaas'];
const pages = new Map(
  await Promise.all(
    routes.map(async (route) => [route, await readFile(path.join(buildRoot, route.slice(1), 'index.html'), 'utf8')])
  )
);

const decodeEntities = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
    const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    return String.fromCodePoint(
      entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1))
    );
  });

// Read attributes independently of HTML minification order, quoting, or whitespace.
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map((match) => [
      match[1].toLowerCase(),
      decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''),
    ])
  );

const openTags = (html) =>
  [...html.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)].map((match) => ({
    tag: match[1].toLowerCase(),
    attributes: attributes(match[0]),
    start: match.index,
    end: match.index + match[0].length,
  }));

const elements = (html, tagName) =>
  openTags(html)
    .filter(({ tag }) => tag === tagName)
    .map((node) => {
      const closingTags = new RegExp(`<(/?)${tagName}\\b[^>]*>`, 'gi');
      let depth = 1;
      for (const match of html.slice(node.end).matchAll(new RegExp(closingTags.source, 'gi'))) {
        depth += match[1] ? -1 : 1;
        if (depth === 0) return { ...node, content: html.slice(node.end, node.end + match.index) };
      }
      assert.fail(`Unclosed ${tagName} element`);
    });

const textContent = (html) =>
  decodeEntities(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const idsOf = (html) => openTags(html).flatMap(({ attributes: attrs }) => (attrs.id ? [attrs.id] : []));
const linksOf = (html) => elements(html, 'a').filter(({ attributes: attrs }) => attrs.href);

const findElement = (html, tagName, predicate) => {
  const element = elements(html, tagName).find(predicate);
  assert.ok(element, `Expected a matching ${tagName} element`);
  return element.content;
};

async function resolveBuiltFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = path.resolve(buildRoot, `.${decoded}`);
  assert.ok(
    candidate === buildRoot || candidate.startsWith(`${buildRoot}${path.sep}`),
    `Path escapes build: ${pathname}`
  );
  const info = await stat(candidate);
  return info.isDirectory() ? path.join(candidate, 'index.html') : candidate;
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? listFiles(path.join(directory, entry.name)) : path.join(directory, entry.name)
      )
    )
  ).flat();
}

for (const [route, html] of pages) {
  test(`${route} has a single page title and accessible primary portfolio navigation`, () => {
    const headings = elements(html, 'h1');
    assert.equal(headings.length, 1, 'Each page needs exactly one h1');
    assert.ok(textContent(headings[0].content).length > 0, 'The h1 must have text');
    assert.equal(elements(html, 'main').length, 1, 'Each page needs one main landmark');

    const header = elements(html, 'header')[0]?.content;
    assert.ok(header, 'Expected a site header');
    assert.ok(
      elements(header, 'nav').some(({ attributes: attrs }) => attrs['aria-label']),
      'Navigation needs a name'
    );
    const portfolioLink = linksOf(header).find(({ attributes: attrs }) => attrs.href === '/portfolio');
    assert.ok(portfolioLink, 'Portfolio must be linked from the header, not only the footer');
    assert.ok(textContent(portfolioLink.content), 'The primary portfolio link must have a visible text label');
    assert.ok(
      linksOf(header).some(({ attributes: attrs }) => ['/', '/#projects', '#top'].includes(attrs.href)),
      'The header must offer a route home'
    );

    const ids = idsOf(html);
    assert.equal(new Set(ids).size, ids.length, 'Duplicate IDs make anchors ambiguous');
  });

  test(`${route} has working local links, image sources, and fragment targets`, async () => {
    const references = openTags(html).flatMap(({ tag, attributes: attrs }) =>
      ['href', 'src']
        .filter((attribute) => attrs[attribute])
        .map((attribute) => ({ tag, attribute, value: attrs[attribute] }))
    );
    for (const { attribute, value } of references) {
      const target = new URL(value, `${origin}${route === '/' ? '/' : `${route}/`}`);
      assert.ok(
        !['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(target.hostname),
        `Local machine URL: ${value}`
      );
      if (target.origin !== origin) continue;
      const file = await resolveBuiltFile(target.pathname);
      await access(file);
      if (attribute === 'href' && target.hash && file.endsWith('.html')) {
        const targetHtml = await readFile(file, 'utf8');
        const fragment = decodeURIComponent(target.hash.slice(1));
        assert.ok(idsOf(targetHtml).includes(fragment), `${route}: ${value} has no matching ID`);
      }
    }

    for (const { attributes: attrs } of openTags(html).filter(({ tag }) => tag === 'img')) {
      assert.ok(Object.hasOwn(attrs, 'alt'), `Image ${attrs.src} needs an alt attribute`);
      assert.ok(attrs.src, 'Every image needs a source');
    }
  });
}

test('the homepage and resume present projects in the chosen order', () => {
  const homepage = pages.get('/');
  const sections = elements(homepage, 'section').map(({ attributes: attrs }) => attrs.id);
  assert.deepEqual(
    sections.filter((id) => projectOrder.includes(id)),
    projectOrder
  );

  const resume = pages.get('/resume');
  const projectLinks = linksOf(resume)
    .map(({ attributes: attrs }) => new URL(attrs.href, origin).pathname)
    .filter((pathname) => pathname.startsWith('/projects/'));
  assert.deepEqual(
    [...new Set(projectLinks)],
    projectOrder.map((project) => `/projects/${project}`)
  );
});

test('the portfolio contents link every document chapter in reading order', () => {
  const html = pages.get('/portfolio');
  const document = findElement(html, 'article', ({ attributes: attrs }) => Boolean(attrs['aria-label']));
  const headings = elements(document, 'h2').map(({ attributes: attrs }) => attrs.id);
  assert.equal(headings.length, 4, 'The overview has three projects and Home Lab');
  const sidebar = elements(html, 'aside')[0]?.content;
  assert.ok(sidebar, 'Expected a contents navigation');
  const targets = linksOf(sidebar)
    .map(({ attributes: attrs }) => decodeURIComponent(attrs.href.slice(1)))
    .filter((id) => headings.includes(id));
  assert.deepEqual(targets, headings, 'Each chapter needs one contents entry in document order');
  const firstProjectHeadings = elements(document, 'h2')
    .map(
      ({ content }) =>
        textContent(content)
          .toLowerCase()
          .match(/^(heimdall|gjallar|k-le-paas)/)?.[1]
    )
    .filter(Boolean);
  assert.deepEqual([...new Set(firstProjectHeadings)], ['heimdall', 'gjallar', 'k-le-paas']);
});

test('both documents have real downloadable PDFs', async () => {
  for (const [route, pdfPath] of [
    ['/portfolio', '/portfolio/yunho-cho-portfolio.pdf'],
    ['/resume', '/resume/yunho-cho-resume.pdf'],
  ]) {
    assert.ok(
      linksOf(pages.get(route)).some(
        ({ attributes: attrs }) => attrs.href === pdfPath && Object.hasOwn(attrs, 'download')
      )
    );
    const pdf = await readFile(await resolveBuiltFile(pdfPath));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.ok(pdf.length > 1024, `${pdfPath} must contain document data`);
    assert.match(pdf.subarray(-1024).toString(), /%%EOF/, `${pdfPath} must be a complete PDF`);
  }
});

test('K-Le-PaaS distinguishes individual contribution from the team implementation', () => {
  const html = pages.get('/projects/klepaas');
  const personal = textContent(
    findElement(html, 'article', ({ attributes: attrs }) => attrs['aria-label'] === 'My contribution')
  );
  const team = textContent(
    findElement(html, 'article', ({ attributes: attrs }) => attrs['aria-label'] === 'Team scope')
  );
  assert.match(personal, /자연어/);
  assert.match(personal, /모니터링|Prometheus/);
  assert.doesNotMatch(personal, /롤백|rollback/i, 'Version rollback was not the individual contribution');
  for (const sentence of team.split(/[.!?]/).filter((sentence) => /롤백|rollback/i.test(sentence))) {
    assert.match(sentence, /팀원/, 'Rollback attribution must remain with the teammate');
  }
  const ownership = textContent(findElement(html, 'section', ({ attributes: attrs }) => attrs.id === 'ownership'));
  assert.match(ownership, /WebSocket[^.]*공동|공동[^.]*WebSocket/, 'The WebSocket path was implemented jointly');
});

test('project outcomes retain their measurement conditions and verified scope', () => {
  for (const route of ['/resume', '/projects/heimdall']) {
    const text = textContent(pages.get(route));
    if (route !== '/projects/heimdall') assert.match(text, /3\s*분/);
    if (/3\s*분/.test(text)) {
      assert.match(text, /개인\s*환경/);
      assert.match(
        text,
        /(?:서버|VM)[^.]{0,100}(?:제외|포함하지)/,
        `${route}: deployment timing excludes server/VM preparation`
      );
    }
    if (route !== '/resume') {
      assert.match(text, /짧은\s*접속\s*중단/, `${route}: gateway recreation is not a zero-downtime guarantee`);
    }
  }
  for (const route of ['/resume', '/projects/gjallar']) {
    const text = textContent(pages.get(route));
    assert.match(text, /Proxmox\s*API/);
    assert.match(text, /cloud-init/);
  }
  for (const route of ['/resume', '/projects/klepaas']) {
    const text = textContent(pages.get(route));
    assert.match(text, /1\s*분\s*58\s*초/);
    assert.match(text, /4\s*분\s*30\s*초/);
    assert.match(text, /팀[^.]{0,100}시연|시연[^.]{0,100}팀/);
    assert.match(text, /평균[^.]{0,100}보장[^.]{0,100}(?:아닙|뜻하지)/);
    assert.match(text, /REST\s*API[^.]{0,60}10\s*초/);
  }
});

test('the public build excludes private document paths and retired project routes', async () => {
  const privatePaths = /(?:1_지원|2_작성자료|4_합격자소서|작성근거|제출본|facts\.json|자기소개서\.(?:md|pdf|docx))/i;
  for (const [route, html] of pages) {
    assert.doesNotMatch(html, privatePaths, `${route} must not expose private career materials`);
    assert.doesNotMatch(html, /(?:href|src)=["'][^"']*\/projects\/argus/);
  }
  for (const file of await listFiles(buildRoot)) {
    assert.doesNotMatch(
      path.relative(buildRoot, file),
      privatePaths,
      `Private document copied into the build: ${file}`
    );
  }
  await assert.rejects(access(path.join(buildRoot, 'projects/argus/index.html')), { code: 'ENOENT' });
  await assert.rejects(access(path.join(buildRoot, 'archive/argus/index.html')), { code: 'ENOENT' });
});

test('portfolio overview links to detail and preserves personal contribution', () => {
  const html = pages.get('/portfolio');
  const body = textContent(findElement(html, 'article', ({ attributes: attrs }) => Boolean(attrs['aria-label'])));
  assert.ok(body.length < 1500, 'Overview should stay concise');
  assert.match(body, /2인 팀/);
  assert.match(body, /담당: 자연어 제어·모니터링/);
  assert.doesNotMatch(body, /1분 58초|4분 30초|3분 이내/);
  for (const slug of projectOrder) {
    assert.ok(linksOf(html).some(({ attributes: attrs }) => attrs.href === `/projects/${slug}`));
  }
});
