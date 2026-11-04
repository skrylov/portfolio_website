import { selectedWork } from '../content/selectedWork'
import InlineContent from './InlineContent'
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
      <div className="work-introduction">
        {selectedWork.paragraphs.map((text, index) => (
          <p key={index}>
            <InlineContent text={text} />
          </p>
        ))}
      </div>
      <div className="work-grid">
        {selectedWork.cases.map((item) => (
          <CaseStudyCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  )
}
