import { selectedWork } from '../content/selectedWork'
import CaseStudyCard from './CaseStudyCard'
import { Section } from './Primitives'
import { revealFocusedSlide } from './revealFocusedSlide'

const mobile = 'smartsaver-native-mobile-apps'
const passiveIncome = 'smartsaver-passive-income'
const infrastructure = 'smartsaver-infrastructure-for-scale'
const banners = 'smartsaver-banner-launches'
const solid = 'solid-solar-prospecting-platform'

// Pair consumer fintech work, cross-platform delivery, and reusable tooling.
// SOLID connects to Mobile through zero-to-one delivery and to Infrastructure
// through platform design.
const relatedCases: Record<string, readonly [string, string]> = {
  [mobile]: [passiveIncome, solid],
  [passiveIncome]: [mobile, infrastructure],
  [infrastructure]: [banners, passiveIncome],
  [banners]: [infrastructure, mobile],
  [solid]: [mobile, infrastructure],
}

export default function RelatedWork({ slug }: { slug: string }) {
  return (
    <Section
      className="related-work mx-auto max-w-[66rem] pb-0"
      aria-labelledby="related-work-heading"
    >
      <h2 id="related-work-heading">Explore more work</h2>
      <div className="work-grid" onFocus={revealFocusedSlide}>
        {relatedCases[slug].map((relatedSlug) => {
          const item = selectedWork.cases.find(
            (entry) => entry.slug === relatedSlug,
          )
          if (!item) throw new Error(`Unknown related case: ${relatedSlug}`)
          return <CaseStudyCard key={item.slug} item={item} />
        })}
      </div>
    </Section>
  )
}
