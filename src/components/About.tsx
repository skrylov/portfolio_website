import { aboutContent as about } from '../content/homepageContent'
import { Section } from './Primitives'

export default function About() {
  return (
    <Section
      id="about"
      aria-labelledby="about-heading"
      className="homepage-about"
    >
      <h2 id="about-heading">{about.heading}</h2>
      <div className="about-layout">
        <div className="about-copy">
          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <img
          className="about-photo"
          src={import.meta.env.BASE_URL + about.photo.publicPath}
          alt={about.photo.alt}
          width={about.photo.width}
          height={about.photo.height}
          loading="lazy"
          decoding="async"
        />
      </div>
    </Section>
  )
}
