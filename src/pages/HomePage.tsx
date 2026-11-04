import { Card, Section } from '../components/Primitives'
import InlineContent from '../components/InlineContent'
import { heroContent as hero, metricsContent } from '../content/homepageContent'
import { ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <section className="portfolio-hero" aria-labelledby="hero-heading">
        <div className="hero-title">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-heading">{hero.headline}</h1>
        </div>
        <img
          className="hero-portrait"
          src={import.meta.env.BASE_URL + hero.portrait.publicPath}
          width={hero.portrait.width}
          height={hero.portrait.height}
          alt={hero.portrait.alt}
          fetchPriority="high"
        />
        <div className="hero-introduction">
          {hero.paragraphs.map((text, index) => (
            <p key={index}>
              <InlineContent text={text} />
            </p>
          ))}
        </div>
        <div className="action-row">
          {hero.links.map((link, index) => (
            <a
              key={link.href}
              className={index === 0 ? 'button' : 'text-link'}
              href={link.href}
            >
              {link.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <Section
        id="metrics"
        tabIndex={-1}
        aria-labelledby="metrics-heading"
        className="homepage-metrics"
      >
        <h2 id="metrics-heading">{metricsContent.heading}</h2>
        <div className="responsive-grid">
          {metricsContent.metrics.map((metric) => (
            <Card key={metric.label}>
              <p className="metric-value">
                <InlineContent text={metric.value} />
              </p>
              <h3 className="metric-label">{metric.label}</h3>
              <p className="metric-description">
                <InlineContent text={metric.description} />
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
