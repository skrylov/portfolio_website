import homepage from './homepage.json'
import media from './media.json'
import heroIntroduction from './homepage/hero-introduction.json'

const files = import.meta.glob(
  ['./homepage/hero.md', './homepage/metrics.md', './homepage/about.md'],
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

// Extract the fields used by the homepage from its known export shapes.
const hero = section('hero')
const textColumn = hero.match(
  /<column ratio="60">\n([\s\S]*?)\n<\/column>/,
)?.[1]
if (!textColumn) throw new Error('Expected hero text column')
const blocks = textColumn.split(/\n\n+/)
const eyebrow = blocks[0].match(/^<span[^>]*>(.*?)<\/span>$/)?.[1]
const headline = blocks[1].match(/^# (.+)$/)?.[1]
const location = blocks.at(-2)?.match(/^<b>(.+)<\/b>$/)?.[1]
const links = [...blocks.at(-1)!.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(
  (match) => ({ label: match[1], href: match[2] }),
)
const portraitSource = hero.match(/<image source="([^"]+)"/)?.[1]
const portrait = media.find((item) => item.source === portraitSource)
if (
  !eyebrow ||
  !headline ||
  !location ||
  links.length !== 3 ||
  !portrait ||
  portrait.status !== 'migrated'
)
  throw new Error('Incomplete hero source')

export const heroContent = {
  eyebrow,
  headline,
  // Issue #11 approved this display override. The original hero remains intact.
  paragraphs: heroIntroduction,
  location,
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

const about = section('about')
const aboutHeading = about.match(/^## (.+)$/m)?.[1]
const [aboutText, aboutImage] = [
  ...about.matchAll(/<column ratio="[^"]+">\n([\s\S]*?)\n<\/column>/g),
].map((match) => match[1])
const aboutImageSource = aboutImage?.match(/<image source="([^"]+)"/)?.[1]
const aboutPhoto = media.find((item) => item.source === aboutImageSource)

if (!aboutHeading || !aboutText || aboutPhoto?.status !== 'migrated')
  throw new Error('Incomplete About source')

export const aboutContent = {
  heading: aboutHeading,
  paragraphs: aboutText.split(/\n\n+/),
  photo: aboutPhoto,
}
