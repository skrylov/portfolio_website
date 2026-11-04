import { Link } from 'react-router'
import { PageHeader, Section } from '../components/Primitives'

export default function NotFoundPage() {
  return (
    <>
      <PageHeader label="404" description="This route does not exist.">
        Page not found
      </PageHeader>
      <Section>
        <Link className="text-link" to="/">
          Return home
        </Link>
      </Section>
    </>
  )
}
