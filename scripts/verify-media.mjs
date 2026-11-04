import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { imageSize } from 'image-size'

const file = (path) => new URL(`../${path}`, import.meta.url)
const readJson = (path) => JSON.parse(readFileSync(file(path), 'utf8'))
const media = readJson('src/content/media.json')
const original = readJson('docs/media-migration/inventory.json')
assert.equal(media.length, 36)
assert.equal(new Set(media.map((entry) => entry.id)).size, 36)
assert.deepEqual(
  media.map((entry) => entry.id).sort(),
  original.map((entry) => entry.id).sort(),
)
const unique = new Map()
for (const entry of media) {
  const baseline = original.find((item) => item.id === entry.id)
  for (const [key, value] of Object.entries(baseline)) {
    if (key !== 'status')
      assert.deepEqual(entry[key], value, `${entry.id}: ${key}`)
  }
  assert.ok(['migrated', 'missing', 'inaccessible'].includes(entry.status))
  assert.equal(entry.status, 'migrated', `Unresolved media: ${entry.id}`)
  assert.equal(entry.fileExists, true)
  assert.match(entry.localPath, /^public\/assets\/content\/[\w./-]+$/)
  assert.ok(!entry.localPath.includes('..'))
  assert.equal(entry.publicPath, entry.localPath.slice('public/'.length))
  assert.ok(existsSync(file(entry.localPath)), entry.localPath)
  const data = readFileSync(file(entry.localPath))
  const info = imageSize(data)
  assert.equal(data.length, entry.byteSize)
  assert.equal(createHash('sha256').update(data).digest('hex'), entry.sha256)
  assert.equal(info.type, entry.format)
  assert.equal(info.width, entry.width)
  assert.equal(info.height, entry.height)
  assert.ok(entry.width > 0 && entry.height > 0)
  assert.ok(entry.localPath.endsWith(`.${entry.format}`))
  if (unique.has(entry.sha256))
    assert.equal(
      unique.get(entry.sha256),
      entry.localPath,
      'Duplicate binary not deduplicated',
    )
  unique.set(entry.sha256, entry.localPath)
  if (entry.deduplicatedTo) {
    const target = media.find((item) => item.id === entry.deduplicatedTo)
    assert.ok(target)
    assert.equal(target.localPath, entry.localPath)
    assert.equal(target.sha256, entry.sha256)
  }
  if (entry.format === 'svg') {
    const svg = data.toString('utf8')
    assert.match(svg, /<svg\b/)
    assert.doesNotMatch(
      svg,
      /<script\b|<foreignObject\b|(?:href|src)\s*=\s*["']https?:|url\(\s*["']?https?:/i,
    )
  }
  if (process.argv.includes('--dist')) {
    const deployed = readFileSync(file(`dist/${entry.publicPath}`))
    assert.ok(
      data.equals(deployed),
      `Build changed or omitted ${entry.publicPath}`,
    )
  }
}
assert.doesNotMatch(JSON.stringify(media), /X-Amz-|[?&](?:Signature|Expires)=/i)
console.log(
  `Media verified: ${media.length} references, ${unique.size} unique local files${process.argv.includes('--dist') ? ', production copies identical' : ''}.`,
)
