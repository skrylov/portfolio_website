import { selectedWork } from '../content/selectedWork'
import { Section } from './Primitives'
import CaseStudyCard from './CaseStudyCard'

export default function SelectedWork() {
  return (
    <Section
      id="selected-work"
      tabIndex={-1}
      aria-labelledby="selected-work-heading"
      className="selected-work"
    >
      <h2 id="selected-work-heading">{selectedWork.heading}</h2>
      <p className="work-introduction">{selectedWork.introduction}</p>
      <div className="work-grid">
        {selectedWork.cases.map((item) => (
          <CaseStudyCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  )
}
