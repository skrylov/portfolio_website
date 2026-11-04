import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import {
  Button,
  ButtonLink,
  Card,
  PageHeader,
  Section,
  SectionHeading,
} from '../components/Primitives'

export default function HomePage() {
  return (
    <>
      <PageHeader
        label="Visual foundation / Preview 01"
        description="A working preview of typography, spacing and shared components. Homepage and case-study content will be presented in later issues."
      >
        Room for
        <br />
        clear thinking.
      </PageHeader>
      <div className="action-row">
        <ButtonLink to="/work/example">
          Open case-study placeholder
          <ArrowRight size={16} aria-hidden="true" />
        </ButtonLink>
        <Link
          className="text-link"
          to={{ pathname: '/', hash: '#type-sample' }}
        >
          Explore the type system ↓
        </Link>
      </div>
      <Section id="selected-work" tabIndex={-1}>
        <SectionHeading label="01 / Components">
          A small, shared vocabulary.
        </SectionHeading>
        <p className="muted reading-width">
          Component samples only. These are not selected-work cards or portfolio
          claims.
        </p>
        <div className="responsive-grid">
          <Card>
            <p className="eyebrow">Surface / 01</p>
            <h3>Space to focus</h3>
            <p>Quiet surfaces, subtle borders and generous internal spacing.</p>
            <Button disabled>Disabled action</Button>
          </Card>
          <Card>
            <p className="eyebrow">Surface / 02</p>
            <h3>Clear hierarchy</h3>
            <p>
              One accent for primary actions. Supporting links keep a lighter
              touch.
            </p>
            <ButtonLink className="button-secondary" to="/work/example">
              View route sample <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </Card>
        </div>
      </Section>
      <Section id="type-sample" tabIndex={-1}>
        <SectionHeading label="02 / Typography">
          Built for reading.
        </SectionHeading>
        <div className="article-sample">
          <h3>Article heading sample</h3>
          <p>
            Body copy uses a comfortable reading width and open line spacing.
            The same scale can support a short introduction or a longer case
            study.
          </p>
          <h4>A supporting heading</h4>
          <p>
            Emphasis, <strong>important details</strong> and{' '}
            <a
              className="text-link"
              href="https://www.linkedin.com/in/s-krylov"
            >
              text links
            </a>{' '}
            remain easy to distinguish.
          </p>
          <p className="caption">
            Caption sample — supporting context without competing with the
            story.
          </p>
        </div>
      </Section>
    </>
  )
}
