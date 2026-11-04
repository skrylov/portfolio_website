import homepage from './homepage.json'
import media from './media.json'

const files = import.meta.glob(
  ['./homepage/hero.md', './homepage/metrics.md'],
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
) as Record<string, string>

function section(id: string) {
  const entry = homepage.sections.find((item) => item.id === id)
  const text = entry && 'body' in entry ? files[`./${entry.body}`] : undefined
  if (!text) throw new Error(`Missing homepage section: ${id}`)
  return text.replace(/\r\n/g, '\n')
}

// Only the existing hero/metric export shapes are supported here. This is not
// a general Notion or case-study renderer. Reject incomplete source extraction.
const hero = section('hero')
const textColumn = hero.match(
  /<column ratio="60">\n([\s\S]*?)\n<\/column>/,
)?.[1]
if (!textColumn) throw new Error('Expected hero text column')
const blocks = textColumn.split(/\n\n+/)
const eyebrow = blocks[0].match(/^<span[^>]*>(.*?)<\/span>$/)?.[1]
const headline = blocks[1].match(/^# (.+)$/)?.[1]
const links = [...blocks.at(-1)!.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(
  (match) => ({ label: match[1], href: match[2] }),
)
const portraitSource = hero.match(/<image source="([^"]+)"/)?.[1]
const portrait = media.find((item) => item.source === portraitSource)
if (
  !eyebrow ||
  !headline ||
  links.length !== 3 ||
  !portrait ||
  portrait.status !== 'migrated'
)
  throw new Error('Incomplete hero source')

export const heroContent = {
  eyebrow,
  headline,
  paragraphs: blocks.slice(2, -1),
  links,
  portrait,
}

const metricsSource = section('metrics')
const heading = metricsSource.match(/^## (.+)$/m)?.[1]
const metrics = [
  ...metricsSource.matchAll(
    /<callout[^>]*>\n## (.+)\n\n<b>(.+)<\/b>\n\n([\s\S]*?)\n<\/callout>/g,
  ),
].map((match) => ({ value: match[1], label: match[2], description: match[3] }))
if (!heading || metrics.length !== 4)
  throw new Error('Expected four source metrics')
export const metricsContent = { heading, metrics }
