import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { parseNotionArticle } from '../src/content/notionArticle.ts'

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const json = (path) => JSON.parse(read(path))
const hash = (value) => createHash('sha256').update(value).digest('hex')
const root = 'src/content/'
const baseline = json('docs/content-migration/verification.json')
const cases = json(`${root}cases.json`)
const home = json(`${root}homepage.json`)
const media = json(`${root}media.json`)
const snapshots = new Map(
  readdirSync(
    new URL('../docs/content-migration/sources/', import.meta.url),
  ).map((name) => {
    const snapshot = json(`docs/content-migration/sources/${name}`)
    assert.equal(hash(snapshot.body), baseline.bodySha256[snapshot.pageId])
    return [snapshot.pageId, snapshot]
  }),
)

assert.equal(cases.length, 5)
assert.equal(new Set(cases.map((item) => item.slug)).size, 5)
assert.deepEqual(cases.map((item) => item.order).sort(), [1, 2, 3, 4, 5])
for (const item of cases) {
  const source = snapshots.get(item.sourcePageId)
  assert.ok(source, `Missing source snapshot for ${item.slug}`)
  assert.equal(read(root + item.body), source.body + '\n', item.slug)
  for (const [field, property] of Object.entries({
    project: 'Project',
    category: 'Category',
    summary: 'Summary',
    focus: 'Focus',
    order: 'Order',
    stage: 'Stage',
    caseStudyLink: 'Case study link',
  }))
    assert.equal(
      item[field],
      source.properties[property],
      `${item.slug}: ${field}`,
    )
  assert.equal(item.title, source.title)
  assert.equal(item.sourceUrl, source.sourceUrl)
  assert.equal(item.sourceLastEditedAt, source.lastEditedAt)
  assert.ok(media.some((entry) => entry.id === item.thumbnailMediaId))
}

const homepage = snapshots.get(home.sourcePageId).body
assert.doesNotMatch(homepage, /^## Coaching and mentoring$/m)
assert.ok(
  homepage.includes(
    'I like coaching, sharing context and helping people become more confident in their decisions.',
  ),
)
const markers = [
  ['hero', null],
  ['metrics', '## A few numbers from my latest work'],
  ['selected-work', '## Selected work'],
  ['about', '## A bit about me'],
  ['contact', "## Let's talk"],
]
for (let i = 0; i < markers.length; i++) {
  const [id, heading] = markers[i]
  const start = heading ? homepage.indexOf(heading) : 0
  const end =
    i + 1 < markers.length
      ? homepage.indexOf(markers[i + 1][1])
      : homepage.length
  assert.ok(start >= 0 && end > start)
  // Only boundary blank lines are normalized when splitting homepage files.
  assert.equal(
    read(`${root}homepage/${id}.md`).trimEnd(),
    homepage.slice(start, end).trimEnd(),
    id,
  )
}
assert.deepEqual(
  home.sections.map((section) => section.id),
  ['hero', 'metrics', 'selected-work', 'about', 'recommendations', 'contact'],
)
assert.equal(
  hash(JSON.stringify(json(`${root}testimonials.json`))),
  baseline.testimonialsSha256,
)
assert.equal(json(`${root}testimonials.json`).length, 8)
for (const item of json(`${root}testimonials.json`)) {
  assert.deepEqual(Object.keys(item).sort(), [
    'companyContext',
    'excerpt',
    'linkedInUrl',
    'name',
    'title',
  ])
}

assert.equal(media.length, 36)
assert.equal(new Set(media.map((entry) => entry.id)).size, media.length)
const imagesInFiles = cases
  .map((item) => root + item.body)
  .concat(
    home.sections
      .filter((section) => section.body)
      .map((section) => root + section.body),
  )
  .flatMap((path) =>
    [...read(path).matchAll(/<image source="([^"]+)"/g)].map((match) => ({
      path,
      source: match[1],
    })),
  )
assert.equal(imagesInFiles.length, 30)
for (const image of imagesInFiles) {
  assert.equal(
    media.filter(
      (entry) =>
        entry.source === image.source && entry.contentFile === image.path,
    ).length,
    1,
  )
}
for (const entry of media) {
  assert.ok(['migrated', 'missing', 'inaccessible'].includes(entry.status))
  assert.ok(entry.intendedLocalPath.startsWith('src/assets/content/'))
  if (entry.kind === 'body') {
    const text = read(entry.contentFile)
    assert.ok(text.split('\n')[entry.line - 1].includes(entry.source))
    if (entry.adjacentCaption) {
      const caption = entry.adjacentCaption
      assert.ok(
        text.split('\n')[caption.line - 1].includes(`<i>${caption.text}</i>`),
      )
    }
  }
}
for (const path of [
  ...cases.map((item) => root + item.body),
  ...home.sections
    .filter((section) => section.body)
    .map((section) => root + section.body),
  ...[
    'cases.json',
    'homepage.json',
    'testimonials.json',
    'media.json',
    'references.json',
  ].map((path) => root + path),
]) {
  assert.doesNotMatch(
    read(path),
    /X-Amz-|[?&](?:Signature|Expires)=/i,
    `Signed URL in ${path}`,
  )
}
console.log(
  'Content verified: 5 exact articles, 5 homepage sections, 8 excerpts, 36 media references.',
)

// Exercise the renderer's source grammar against the only published article.
const reference = cases.find(
  (item) => item.slug === 'smartsaver-native-mobile-apps',
)
assert.ok(reference)
const referenceFile = root + reference.body
const blocks = parseNotionArticle(read(referenceFile), referenceFile)
function flatten(blocks) {
  return blocks.flatMap((block) => [
    block,
    ...(block.kind === 'columns'
      ? block.columns.flatMap((column) => flatten(column.blocks))
      : block.blocks
        ? flatten(block.blocks)
        : []),
  ])
}
const parsed = flatten(blocks)
const renderedImages = parsed.filter((block) => block.kind === 'image')
assert.deepEqual(
  renderedImages.map(({ source, line }) => ({ source, line })),
  media
    .filter((entry) => entry.contentFile === referenceFile)
    .map(({ source, line }) => ({ source, line })),
)
assert.equal(parsed.filter((block) => block.kind === 'heading').length, 8)
assert.equal(parsed.filter((block) => block.kind === 'callout').length, 3)
assert.deepEqual(
  parsed.filter((block) => block.kind === 'toggle').map((block) => block.label),
  [['More screens from the mobile experience'], ['The next release']],
)
assert.equal(
  parsed
    .filter((block) => block.kind === 'list')
    .flatMap((block) => block.items).length,
  7,
)
for (const [source, diagnostic] of [
  [
    '<toggle>\nTitle\n<callout icon="📱">\n</toggle>',
    /fixture:4.*unexpected block/,
  ],
  ['<database>\nText\n</database>', /fixture:1.*Unsupported/],
  ['Text <script>alert(1)</script>', /fixture:1.*inline markup/],
  ['[Example](javascript:alert(1))', /fixture:1.*Unsupported link destination/],
]) {
  assert.throws(() => parseNotionArticle(source, 'fixture'), diagnostic)
}
const [linkBlock, separator] = parseNotionArticle(
  '<b>Text <i>[Link](https://example.com/path(a))</i></b>\n---',
  'fixture',
)
assert.deepEqual(linkBlock.content, [
  {
    kind: 'strong',
    children: [
      'Text ',
      {
        kind: 'emphasis',
        children: [
          {
            kind: 'link',
            href: 'https://example.com/path(a)',
            children: ['Link'],
          },
        ],
      },
    ],
  },
])
assert.equal(separator.kind, 'separator')
console.log(
  'Native Mobile renderer verified: block counts, image order, nested markup and rejected input.',
)
