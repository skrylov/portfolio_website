import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { selectedWork } from '../content/selectedWork'
import InlineContent from './InlineContent'

export default function CaseStudyCard({
  item,
}: {
  item: (typeof selectedWork.cases)[number]
}) {
  return (
    <article className="work-card">
      <Link to={`/work/${item.slug}`}>
        <div className="work-image">
          <img
            src={import.meta.env.BASE_URL + item.thumbnail.publicPath}
            width={item.thumbnail.width}
            height={item.thumbnail.height}
            alt={item.thumbnail.alt}
            loading="lazy"
          />
        </div>
        <div className="work-details">
          <p className="eyebrow">{item.category}</p>
          <h3>{item.project}</h3>
          <p className="work-summary">
            <InlineContent text={item.summary} />
          </p>
          <p className="work-focus">
            <InlineContent text={item.focus} />
          </p>
          <span className="work-action">
            Read case study <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}
