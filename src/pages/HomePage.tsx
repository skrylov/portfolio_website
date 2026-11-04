import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Homepage placeholder</h1>
      <Link to="/work/example" className="inline-flex items-center gap-2">
        Open case-study placeholder
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  )
}
