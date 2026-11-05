import { ChevronDown } from 'lucide-react'
import { aboutContent as about } from '../content/homepageContent'
import { Section } from './Primitives'

const topics = [
  'My path into product',
  'Customer discovery and design',
  'Working across functions',
  'People and teams',
]

if (about.paragraphs.length !== topics.length)
  throw new Error('Expected one About paragraph per topic')

export default function About() {
  return (
    <Section
      id="about"
      aria-labelledby="about-heading"
      className="homepage-about"
    >
      <h2 id="about-heading">{about.heading}</h2>
      <div className="about-layout">
        <img
          className="about-photo"
          src={import.meta.env.BASE_URL + about.photo.publicPath}
          alt={about.photo.alt}
          width={about.photo.width}
          height={about.photo.height}
          loading="lazy"
          decoding="async"
        />
        <div className="about-accordion">
          {topics.map((topic, index) => (
            <details key={topic} name="about-topics" open={index === 0}>
              <summary>
                {topic}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>{about.paragraphs[index]}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
