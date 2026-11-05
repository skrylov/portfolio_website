import { useId } from 'react'
import { ArrowUpRight } from 'lucide-react'
import contactSource from '../content/homepage/contact.md?raw'
import { Section } from './Primitives'

const [, introduction, , actions] = contactSource
  .replace(/\r\n/g, '\n')
  .split(/\n\n+/)
const links = [...(actions ?? '').matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)]
const email = links.find((link) => link[2].startsWith('mailto:'))
const linkedIn = links.find((link) =>
  link[2].startsWith('https://www.linkedin.com/'),
)

export default function ContactCta({
  heading = 'Interested in working together?',
}: {
  heading?: string
}) {
  const id = useId()
  if (!introduction || !email || !linkedIn)
    throw new Error('Incomplete contact source')
  return (
    <Section
      className="mx-auto mt-section-block max-w-[66rem] border-t border-line"
      aria-labelledby={id}
    >
      <h2 id={id}>{heading}</h2>
      <p className="lead mt-4">{introduction}</p>
      <div className="action-row">
        <a className="button" href={email[2]}>
          {email[1]} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="button button-secondary" href={linkedIn[2]}>
          {linkedIn[1]} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </Section>
  )
}
