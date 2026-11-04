# Issue #5 content migration report

Migration date: 2026-11-04. This report describes source coverage, not a copy edit.
No source Notion pages were changed. No image binaries were downloaded.

## Source coverage

| Source                                                                                | Order | Body headings          | List items | Images | Callouts | Toggles |
| ------------------------------------------------------------------------------------- | ----- | ---------------------- | ---------- | ------ | -------- | ------- |
| [Homepage](https://app.notion.com/p/4013732f32cc81d7a35acda97dd69581)                 | —     | 10 original / 9 active | 0          | 2      | 4        | 0       |
| [Native Mobile Apps](https://app.notion.com/p/4023732f32cc81738b29f26341e5521b)       | 1     | 8                      | 7          | 7      | 3        | 2       |
| [Passive Income](https://app.notion.com/p/4003732f32cc81e986e7d5df616b4b9e)           | 2     | 7                      | 4          | 3      | 3        | 1       |
| [Infrastructure for Scale](https://app.notion.com/p/4053732f32cc81b5a7f3e4f9fefa321c) | 3     | 8                      | 6          | 5      | 3        | 2       |
| [Banner Launches](https://app.notion.com/p/4053732f32cc811eaa3af0d5b177eca6)          | 4     | 7                      | 4          | 10     | 3        | 2       |
| [SOLID](https://app.notion.com/p/4003732f32cc8126a78dea067c88ab5d)                    | 5     | 7                      | 4          | 3      | 3        | 0       |

Counts include headings inside metric callouts. None of these six exported bodies
contains a table or quotation block. The testimonial source contributes eight
selected quotation excerpts, not full recommendations. Source titles, properties,
edit timestamps, bodies, and stable media identities are saved in six JSON audit
snapshots named by source page ID under `sources/`.

The homepage gallery was queried separately through its saved view: exactly five
rows, no further page, sorted by Order ascending. Project, Category, Summary,
Focus, Order, Stage, and Case study link matched each fetched case's properties.
The gallery's five thumbnails are represented in the media manifest. The trailing
Selected Work database occurrence points to the same collection and is preserved
in the contact snapshot; future rendering should bind it locally, not fetch it.

## Files and format decisions

- `src/content/cases.json` and five `src/content/cases/*.md` files separate stable
  slugs and ordering from long-form article bodies.
- `src/content/homepage.json` and five `src/content/homepage/*.md` files separate
  meaningful homepage sections. Recommendations reference the excerpt collection.
- `src/content/testimonials.json` stores only the five requested fields per person.
- `src/content/media.json` and `references.json` preserve media positions and
  source provenance, plus local bindings for mentions and databases.
- `src/content/README.md` documents the Notion-flavored Markdown convention and
  its future-renderer limitations.
- `docs/content-migration/sources/*.json` and `verification.json` preserve the
  audit baseline. The standalone coaching section is omitted from both the public
  homepage snapshot and active content. Snapshot metadata records the deliberate
  redaction; the About paragraph mentioning coaching remains intact.
- `scripts/verify-content.mjs` and `npm run verify:content` provide a dependency-free
  offline fidelity check. `.prettierignore` protects verbatim article/section files.
  The root README links the guide and verification command.

The Notion tag form is retained instead of converting complex blocks to plain
Markdown and losing their grouping, nested contents, or labels. This requires a
future renderer to support those tags; the current placeholder routes are unchanged.
No runtime Notion connection or new dependency is added. Homepage splitting only
normalizes boundary blank lines; paragraph text and markup are preserved.

## Verification performed

- Fetched all six copy sources and the two reference documents through the Notion
  connection. Re-fetched all six copy sources and the testimonial document; every
  complete body and fetched display title matched the initial retrieval.
- Compared all five article files exactly against the exported source bodies,
  including headings, paragraphs, emphasis, list items, links, callouts, and all
  seven toggle subtrees. Exact body equality also checks numerical claims and
  narrative sequence without selectively sampling figures.
- Compared each active homepage section against its original source slice.
  Confirmed four metric callouts, five selected-work records, all About copy and
  contact links. Only the standalone coaching section is excluded. Following PR
  review, its copy was also removed from the public audit snapshot (including its
  trailing section divider); the homepage baseline hash now covers that redacted
  body. The verifier checks the redaction and preservation of the About paragraph.
- Compared gallery metadata with fetched page properties for all five cases;
  preserved Order 1–5 and the existing blank Case study link values.
- Extracted each testimonial excerpt and attribution directly from the supplied
  selection document, preserving punctuation and capitalization. No LinkedIn
  recommendation page was scraped or copied.
- Accounted for 30 inline images/diagrams, five thumbnails, and one cover. Checked
  every body image's file and line, plus adjacent single/group caption references.
- Scanned active copy/metadata for signed URLs; none remain. No media was downloaded,
  optimized, replaced, or moved as part of issue #6.

Run `npm run verify:content`, `npm run lint`, `npm run typecheck`,
`npm run format:check`, and `npm run build` to repeat repository checks. The PR
records the actual results for this revision.

All five commands passed locally on Node.js 24.22.1 after `npm ci`. The existing
lockfile was unchanged. Installation reported 10 moderate audit findings in the
existing dependency tree; dependency remediation is outside this content migration.

## Known limitations and ambiguities

- All supplied pages were accessible; no known body text was reconstructed or
  filled from memory. The connector returned closing content wrappers but did not
  expose `truncated`, `unknown_block_count`, or `unknown_block_ids` metadata. Thus
  full fidelity is verified against its complete returned export, not an
  independently enumerated raw Notion block tree or visual comparison of every
  block. The export notes in each audit snapshot make this limitation explicit.
- The original mobile case says "In about six weeks" in a metric and "Roughly
  5 weeks" in its outcome section; the homepage uses "\\~5 weeks". These source
  differences are retained. Infrastructure metadata says "\\~40 templates", while
  the article uses "40+". No numerical claim has been reconciled or improved.
- The [testimonial selection document](https://app.notion.com/p/40e3732f32cc8155bfffe79cfd4368ff)
  still says "Proposed selection — for review" and contains an unchecked approval
  checklist. The user's explicit issue #5 instruction treats this exact document
  as approved and takes precedence. Only its eight selected excerpts/attributions
  enter active content; editorial notes and the checklist do not.
- The [approved design direction](https://app.notion.com/p/40e3732f32cc818fb031c9cce7777b18)
  was read for section scope only. No palette, layout, carousel, or styling was
  implemented.
- Unlabelled Notion page mentions retain their original URLs and have local title/
  slug mappings in `references.json`. Their fetched body syntax has no explicit
  label; a future renderer can use the referenced source title rather than invent
  wording. Metadata summaries retain the export's Markdown escapes.
- Some captions are adjacent italic paragraphs rather than intrinsic image
  captions. Those paragraphs remain exactly in place; the media manifest marks
  shared captions as groups. No alternative text was invented.
- Source asset locators are identifiers, not production URLs. The unsigned cover
  storage locator may require renewed access through the source page. Local paths
  do not exist until issue #6; media rendering must wait for that work.

## Review checklist

1. Open each source URL and its matching JSON/Markdown pair. Confirm the original
   page title, all heading levels, paragraphs, emphasis, lists, links, and ending.
2. Expand every source toggle (2 mobile, 1 Passive Income, 2 Infrastructure,
   2 Banners); compare every nested image and caption in its original position.
3. Compare each metric, percentage, date, timeframe, caveat and attribution without
   reconciling differences between source sections.
4. Check five case metadata records and Order 1–5 against the selected-work gallery.
5. Check homepage sections against the hub. Confirm standalone coaching exclusion
   and preservation of the original About paragraph that mentions coaching.
6. Compare the eight excerpt/name/title/context/LinkedIn tuples with the exact
   supplied selection document, in order.
7. Review all 36 media entries and their planned paths before issue #6. Do not
   treat an absent local image file as missing migrated copy.
8. Run the offline fidelity and standard repository checks before merging.
