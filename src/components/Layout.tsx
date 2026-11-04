import { Link, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-8">
        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  )
}
