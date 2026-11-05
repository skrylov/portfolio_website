import source from './homepage/selected-work.md?raw'
import introduction from './homepage/selected-work-introduction.json'
import homepage from './homepage.json'
import cases from './cases.json'
import media from './media.json'

const section = homepage.sections.find((entry) => entry.id === 'selected-work')
if (
  section?.body !== 'homepage/selected-work.md' ||
  homepage.selectedWork.items !== 'cases.json'
) {
  throw new Error('Unexpected Selected Work source mapping')
}
const heading = source.match(/^## (.+)$/m)?.[1]
if (!heading) throw new Error('Missing Selected Work heading')
export const selectedWork = {
  heading,
  // Issue #30 uses a shorter introduction for display and retains the audited source.
  introduction,
  cases: [...cases]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const thumbnail = media.find(
        (entry) => entry.id === item.thumbnailMediaId,
      )
      if (!thumbnail || thumbnail.status !== 'migrated')
        throw new Error(`Missing thumbnail: ${item.slug}`)
      return { ...item, thumbnail }
    }),
}
