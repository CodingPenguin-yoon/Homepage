import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const webOnly = args.includes('--web-only');
const sourceRoot = path.resolve(
  args.find((argument) => !argument.startsWith('--')) || path.join(websiteRoot, '..', 'career-docs')
);
const documentsRoot = path.join(sourceRoot, '3_대표서류');
const imagePrefix = '제작/portfolio/public/images/';
// Only these public representative documents and their explicitly referenced
// screenshots may leave career-docs. Never copy applications or writing materials.
const source = await readFile(path.join(documentsRoot, '포트폴리오.md'), 'utf8');
const imageNames = [...source.matchAll(/!\[[^\]]*\]\(제작\/portfolio\/public\/images\/([^)]+)\)/g)].map(
  (match) => match[1]
);

for (const imageName of imageNames) {
  if (path.basename(imageName) !== imageName || !/\.(png|jpe?g|webp)$/i.test(imageName)) {
    throw new Error(`Unsupported public portfolio image: ${imageName}`);
  }
}

// The web page is a short project overview. Detailed source content stays in
// career-docs and the downloadable PDF; syncing must not restore the long page.
const overview = await readFile(path.join(websiteRoot, 'scripts/portfolio-overview.md'), 'utf8');
const webDocument = `---\ntitle: 조윤호 포트폴리오\n---\n\n<!-- Generated from scripts/portfolio-overview.md. Edit that source, then sync. -->\n\n${overview}`;

await mkdir(path.join(websiteRoot, 'src/documents'), { recursive: true });
await writeFile(
  path.join(websiteRoot, 'src/documents/portfolio.md'),
  await format(webDocument, { parser: 'markdown' })
);
if (!webOnly) {
  await mkdir(path.join(websiteRoot, 'public/portfolio/images'), { recursive: true });
  await mkdir(path.join(websiteRoot, 'public/resume'), { recursive: true });
  await copyFile(
    path.join(documentsRoot, '포트폴리오.pdf'),
    path.join(websiteRoot, 'public/portfolio/yunho-cho-portfolio.pdf')
  );
  await copyFile(path.join(documentsRoot, '이력서.pdf'), path.join(websiteRoot, 'public/resume/yunho-cho-resume.pdf'));
  for (const imageName of new Set(imageNames)) {
    await copyFile(
      path.join(documentsRoot, imagePrefix, imageName),
      path.join(websiteRoot, 'public/portfolio/images', imageName)
    );
  }
}

console.log(
  webOnly
    ? 'Updated the website portfolio text. Existing PDFs and images were not copied or changed.'
    : `Synced the website portfolio, two representative PDFs, and ${new Set(imageNames).size} portfolio images.`
);
