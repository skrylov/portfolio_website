import { useParams } from 'react-router'
import { ButtonLink, PageHeader, Section } from '../components/Primitives'

export default function CaseStudyPage() {
  const { slug } = useParams()

  return (
    <>
      <PageHeader
        label="Route preview / Case study"
        description="This is a placeholder for evaluating the shared shell. The article layout and migrated content are not implemented here."
      >
        Case-study placeholder
      </PageHeader>
      <Section>
        <p className="metadata">Route slug: {slug}</p>
        <ButtonLink className="button-secondary" to="/">
          Return to preview
        </ButtonLink>
      </Section>
    </>
  )
}
