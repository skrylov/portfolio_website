import { useParams } from 'react-router'
import CaseStudyArticle from '../components/CaseStudyArticle'
import cases from '../content/cases.json'
import NotFoundPage from './NotFoundPage'

const articles = import.meta.glob<string>('../content/cases/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

export default function CaseStudyPage() {
  const { slug } = useParams()
  const project = cases.find((item) => item.slug === slug)
  if (!project) return <NotFoundPage />

  const article = articles['../content/' + project.body]
  if (article === undefined)
    throw new Error('Missing case-study body: ' + project.body)
  return (
    <CaseStudyArticle key={project.slug} project={project} source={article} />
  )
}
