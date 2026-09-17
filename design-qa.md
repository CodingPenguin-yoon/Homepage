# Homepage redesign QA · 2026-09-16

final result: passed

## Target and evidence

- Source: user-supplied Imweb Attention screenshot; working copy `/tmp/homepage-design-qa/reference.png`.
- Implementation: `http://localhost:4321/`, `/tmp/homepage-design-qa/desktop.png`.
- Combined visual comparison: `/tmp/homepage-design-qa/comparison.png`.
- Desktop viewport: 1280 × 720 CSS pixels, screenshot 1280 × 720 (1×).
- Source: 1752 × 1098 screenshot; website region cropped at (176,245), 1400 × 726. Comparison scales source to 960 × 498 and implementation to 960 × 540. Different heights are recorded rather than treated as pixel-exact parity.
- State: homepage at top, no dialog. Mobile checked at 390 × 844; document scroll width was 390. Viewport override reset after testing.
- This is an adaptation of the supplied reference, not a template clone: black typography, personal identity, reduced decoration, no wire sphere or scrolling service labels. These choices implement the user's understated personal-homepage brief.

## Findings and comparison history

1. P1: inherited dark-mode body styling initially made header navigation unreadable. Increased the page-scoped body selector specificity; final desktop/mobile captures show dark text on the light canvas.
2. P2: display font was initially named without loading its asset. Imported the locally installed Inter variable font; rechecked title sizing and wrapping after font load.
3. Final combined comparison: no remaining P0/P1/P2 findings within the homepage redesign scope.

## Required surfaces

- Typography: large single-line Inter name, restrained weight, IBM Plex Sans KR body, clear contrast between title and supporting text. No clipping at tested desktop/mobile sizes.
- Layout: wide margins, quiet header, spacious hero, consistent project rows; mobile collapses to a single column. Comparison intentionally changes the reference's decorative hero to a typographic introduction.
- Color: warm white and near-black, muted readable supporting copy; dark contact section. Original blue and project color bands removed from the home page.
- Images: no raster assets in the revised homepage; decorative reference sphere intentionally omitted. Icons use existing Tabler assets. Detailed project screenshots remain on existing project routes.
- Content: identity and development direction lead; project descriptions reuse existing public data. No new achievement or performance claims.
- Focused checks: mobile header links, hero title, project descriptions and contact address inspected separately in browser screenshots; no overflow or truncation observed.

## Verification

- Clicked Work and Contact anchors, Back to top, Heimdall detail and its return-home link.
- All local links, fragment targets and PDFs checked by the existing 18-test homepage suite: passed.
- Astro check: zero errors/warnings. ESLint: passed. Production build: passed.
- Browser error logs: none at the checked homepage state.
- Existing detail/resume/portfolio pages retain their designs; broader visual harmonization was not part of this homepage implementation.
- Mail links inspected without opening an external mail client; external GitHub destinations were not exercised.

## Implementation checklist

- [x] Simplify homepage composition and palette.
- [x] Verify desktop and mobile rendering.
- [x] Resolve theme/font issues and recheck.
- [x] Verify navigation and production output.
- [x] Leave local preview open; no deployment performed.

## Follow-up: name and role only

User approved simplifying the hero to `Yunho Cho.` and `Platform Engineer`. Removed the small top labels, introductory paragraphs, hero document links and scroll prompt. Portfolio and Resume are now in the header. This supersedes the original hero content target; no background decoration was added in this scoped edit.

Desktop and 390 × 844 mobile screenshots: `/tmp/homepage-design-qa/refined-desktop.png`, `/tmp/homepage-design-qa/refined-mobile.png`. Both were visually inspected: clear name/role hierarchy, no clipping, readable navigation. Mobile content width equals viewport width (390px). Temporary viewport reset. Astro/ESLint and whitespace checks passed. No remaining P0/P1/P2 findings for this refinement.

## Portfolio visual harmonization

Applied the approved homepage direction to `/portfolio`: warm white canvas, black typography, large Inter `Portfolio.` title, thin rules, monochrome project index and chapter headings. Body Markdown, illustrations, metrics, ownership qualifications, chapter IDs and PDF files unchanged. Contact title follows the user's `Let’s talk.` preference.

Evidence: `/tmp/homepage-design-qa/portfolio-desktop.png`, `/tmp/homepage-design-qa/portfolio-body.png`, `/tmp/homepage-design-qa/portfolio-mobile.png`. Desktop and 390 × 844 mobile inspected. Title, sidebar, tables, captions and images remain readable; mobile scrollWidth = innerWidth = 390. Final chapter anchor lands at 96px below an 88px sticky header. Header, project links, contents and PDF destinations remain covered by the existing 18 passing structure/link tests. Browser error logs empty. Astro check, ESLint and diff whitespace validation passed. No new assets or content claims introduced. No remaining P0/P1/P2 findings in the changed page. Original homepage QA evidence above remains historical.

final result: passed
