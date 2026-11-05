import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { Container } from './Primitives'

export default function Layout() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1
      target.scrollIntoView()
      target.focus({ preventScroll: true })
    } else window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
