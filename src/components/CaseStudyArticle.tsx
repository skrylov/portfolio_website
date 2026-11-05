import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import type cases from '../content/cases.json'
import { articleHeadings, articleSections } from '../content/articleNavigation'
import { parseNotionArticle } from '../content/notionArticle'
import ArticleContent from './ArticleContent'
import ContactCta from './ContactCta'
import InlineContent from './InlineContent'
import '../case-study.css'

export default function CaseStudyArticle({
  project,
  source,
}: {
  project: (typeof cases)[number]
  source: string
}) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = project.project + ' | Sergey Krylov'
    return () => {
      document.title = previousTitle
    }
  }, [project.project])

  const headings = articleHeadings[project.slug]
  const blocks = parseNotionArticle(source, project.body).map((block) => {
    if (block.kind !== 'heading' || block.content.length !== 1) return block
    const section = articleSections.find(
      (_, index) => headings?.[index] === block.content[0],
    )
    return section ? { ...block, id: section.id } : block
  })
  return (
    <>
      <article className="case-article" aria-labelledby="case-heading">
        <header className="case-header">
          <Link
            className="case-back text-link"
            to={{ pathname: '/', hash: '#selected-work' }}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to Selected Work
          </Link>
          <p className="eyebrow">{project.category}</p>
          <h1 id="case-heading">{project.project}</h1>
          <p className="lead">
            <InlineContent text={project.summary} />
          </p>
          <dl className="case-focus">
            <dt className="eyebrow">Focus</dt>
            <dd className="metadata">
              <InlineContent text={project.focus} />
            </dd>
          </dl>
        </header>
        <ArticleContent blocks={blocks} body={project.body} />
      </article>
      <ContactCta />
    </>
  )
}
