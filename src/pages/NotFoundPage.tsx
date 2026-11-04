import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Page not found</h1>
      <Link to="/">Return home</Link>
    </>
  )
}
