# Local portfolio content

Issue #6 update: all 36 media references are now migrated, backed by 31 unique
original files under `public/assets/content/`. The actual `localPath` is a
repository path; construct future image URLs with
`import.meta.env.BASE_URL + entry.publicPath`. `intendedLocalPath` remains the
original inventory plan, not the migrated location. See
[the media report](../../docs/media-migration/report.md) for the complete inventory,
deduplication and source discrepancies. `npm run verify:media` checks the files;
after building, add `-- --dist` to verify production copies. The pending-image
descriptions below document the original issue #5 snapshot convention; use the
current manifest's migration status and actual paths for implementation.

This directory contains copy, metadata, and media references migrated from Notion
for issue #5. Nothing here connects to Notion at runtime. The current React
placeholder pages intentionally do not render this content yet.

## Files

- `cases.json`: five cases with stable slugs, original fetched titles, Project,
  Category, Summary, Focus, Order, Stage, source IDs/URLs and body filenames. Sort
  by `order` for selected-work cards; changing order does not require editing an
  article. `project` retains the exact Notion Project property; `title` retains
  the fetched page display title, including its icon. Empty `caseStudyLink`
  properties remain empty; `sourceUrl` always points to the actual source page.
- `cases/*.md`: complete case-study bodies in original narrative order. The page
  title lives in metadata because Notion's body does not repeat it as an H1.
- `homepage.json`: section sequence, source, selected-work binding and cover ID.
  `homepage/*.md` contains hero/introduction, four metrics, selected-work intro,
  About, and contact. The recommendations section references `testimonials.json`.
- `testimonials.json`: only the eight selected excerpts, names, titles, company
  context and author LinkedIn URLs, in the supplied document's order. No full
  recommendations or editorial focus labels are included.
- `media.json`: every body image/diagram, gallery thumbnail, and page cover,
  with stable source identity, position, original filename, caption information,
  and intended local asset path. All 36 entries await issue #6; paths are plans,
  not existing files or image URLs to request in production.
- `references.json`: source provenance, local page-mention mappings, and bindings
  for the two Notion database occurrences to the same local case collection.

All filenames in JSON are relative to this directory, except media
`contentFile`/`intendedLocalPath`, which are repository-relative paths.

## Fidelity format

The `.md` files retain the connector's **Notion-flavored Markdown** verbatim.
Ordinary headings, paragraphs, lists, links, escapes, and emphasis coexist with
`<columns>`, `<column>`, `<callout>`, `<toggle>`, `<image>`, `<mention>`, `<span>`,
and empty `<p />` markers. These preserve source hierarchy, expandable content,
grouped imagery, callout labels, and empty paragraphs without a lossy conversion.
Metadata strings also retain Notion's Markdown escapes, such as `\~`.

This is a documented source format, not MDX or ready-to-render HTML. A generic
Markdown renderer alone will not interpret the Notion tags faithfully. A future
rendering issue must explicitly map them to local components, resolve page
mentions using `references.json`, bind databases to `cases.json`, and resolve
images through `media.json`. Do not execute these tags or fetch their Notion
URLs. No renderer, parser dependency, typography, or styling is introduced here.
Source color/column attributes are preserved for audit fidelity, not adopted as
website design decisions.

Body image `source` values are stable `notion-file-block://` identifiers, not
expiring downloads. Thumbnail references retain Notion's stable encoded file
identity. The homepage cover uses its unsigned storage locator plus source-page
URL; refresh access from that page during issue #6. Never use these values as
production `src` attributes. There are no signed download URLs in the content.

`sourceCaption: null` means the exported image block has no intrinsic caption.
Captions authored as separate italic paragraphs stay at their original positions
in Markdown. Where present, `adjacentCaption` records the exact paragraph, line,
and whether it describes one image or an image group. Do not duplicate group
captions under every image or invent alt text during this migration.

## Scope and verification

The standalone Coaching and mentoring section is excluded from active content
and navigation. The original About paragraph mentioning coaching remains intact.
The audit snapshot in `docs/content-migration/sources/` also omits that standalone
section and records the redaction without retaining its copy. Its body hash covers
the redacted export. All other homepage copy remains intact.

Run `npm run verify:content` to compare all articles and homepage sections against
the source snapshots, check metadata and ordering, pin the eight excerpt values,
and validate media positions/captions and absence of signed URLs. Prettier ignores
the verbatim Markdown files so it cannot reflow their wording or markup.

The offline check detects drift against a reviewed snapshot; it cannot discover
later Notion edits or prove the export service omitted no blocks. For a deliberate
content update, fetch the same source IDs, compare the complete bodies/properties,
review changes and exclusions, then update the snapshots, content, and verification
hashes together. Do not regenerate hashes merely to silence a failed check.

See [the migration report](../../docs/content-migration/report.md) for source
coverage, known ambiguities, and the review checklist.
