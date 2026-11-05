import { useParams } from 'react-router'
import CaseStudyArticle from '../components/CaseStudyArticle'
import { ButtonLink, PageHeader, Section } from '../components/Primitives'
import cases from '../content/cases.json'
import NotFoundPage from './NotFoundPage'

const articles = import.meta.glob(
  '../content/cases/smartsaver-native-mobile-apps.md',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
)

export default function CaseStudyPage() {
  const { slug } = useParams()
  const project = cases.find((item) => item.slug === slug)
  if (!project) return <NotFoundPage />

  const article = articles['../content/' + project.body]
  if (typeof article === 'string')
    return <CaseStudyArticle project={project} source={article} />

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
