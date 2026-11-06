import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, type To } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { articleHeadings, articleSections } from '../content/articleNavigation'
import { heroContent } from '../content/homepageContent'
import { Container } from './Primitives'

type NavigationItem = { label: string; to: To }
const home: NavigationItem = {
  label: 'Home',
  to: { pathname: '/', hash: '#hero-heading' },
}
const work: NavigationItem = {
  label: 'Selected Work',
  to: { pathname: '/', hash: '#selected-work' },
}
const homepageLinks: NavigationItem[] = [
  work,
  { label: 'Recommendations', to: { pathname: '/', hash: '#recommendations' } },
  { label: 'About', to: { pathname: '/', hash: '#about' } },
]
const cv = heroContent.links.find((link) => link.label === 'My CV')
if (!cv) throw new Error('Missing portfolio CV link')
const cvUrl = cv.href

function NavigationLinks({
  items,
  contact,
  onNavigate,
}: {
  items: NavigationItem[]
  contact: To
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="navigation-links">
        {items.map(({ label, to }) => (
          <Link key={label} to={to} onClick={onNavigate}>
            {label}
          </Link>
        ))}
      </div>
      <div className="navigation-actions">
        <a
          className="navigation-cv button button-secondary"
          href={cvUrl}
          onClick={onNavigate}
        >
          View CV <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <Link
          className="navigation-contact button"
          to={contact}
          onClick={onNavigate}
        >
          Contact
        </Link>
      </div>
    </>
  )
}

function MobileNavigation({
  items,
  contact,
}: {
  items: NavigationItem[]
  contact: To
}) {
  const [open, setOpen] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)

  function close(restoreFocus: boolean) {
    if (restoreFocus) toggle.current?.focus({ preventScroll: true })
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    function dismissOutside(event: Event) {
      if (
        event.target instanceof Node &&
        !wrapper.current?.contains(event.target)
      )
        close(
          document.activeElement === document.body ||
            Boolean(panel.current?.contains(document.activeElement)),
        )
    }
    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      close(true)
    }
    function dismissOnScroll() {
      close(Boolean(panel.current?.contains(document.activeElement)))
    }

    document.addEventListener('click', dismissOutside)
    document.addEventListener('focusin', dismissOutside)
    document.addEventListener('keydown', dismissOnEscape)
    window.addEventListener('scroll', dismissOnScroll, { passive: true })
    const desktop = window.matchMedia('(min-width: 56rem)')
    const dismissOnDesktop = () => {
      if (desktop.matches) close(false)
    }
    desktop.addEventListener('change', dismissOnDesktop)
    return () => {
      document.removeEventListener('click', dismissOutside)
      document.removeEventListener('focusin', dismissOutside)
      document.removeEventListener('keydown', dismissOnEscape)
      window.removeEventListener('scroll', dismissOnScroll)
      desktop.removeEventListener('change', dismissOnDesktop)
    }
  }, [open])

  return (
    <div className="mobile-navigation" ref={wrapper}>
      <button
        ref={toggle}
        className="navigation-toggle"
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav
        ref={panel}
        id="mobile-navigation-panel"
        aria-label="Main navigation"
        className="mobile-navigation-panel"
        inert={!open}
      >
        <NavigationLinks
          items={items}
          contact={contact}
          onNavigate={() => close(true)}
        />
      </nav>
    </div>
  )
}

export default function SiteHeader() {
  const { pathname, key } = useLocation()
  const slug = pathname.match(/^\/work\/([^/]+)\/?$/i)?.[1]
  const isCase = Boolean(slug && articleHeadings[slug])
  const items = isCase
    ? [
        { ...work, label: 'Back to Work' },
        ...articleSections.map(({ id, label }) => ({
          label,
          to: { pathname, hash: '#' + id },
        })),
      ]
    : homepageLinks
  const contact = { pathname, hash: '#contact' }

  return (
    <>
      <header className="site-header">
        <Container>
          <div className="header-row">
            <Link className="wordmark" to="/" aria-label="Sergey Krylov — home">
              Sergey Krylov<span>Product management</span>
            </Link>
            <nav className="desktop-navigation" aria-label="Main navigation">
              <NavigationLinks items={items} contact={contact} />
            </nav>
          </div>
        </Container>
      </header>
      <MobileNavigation key={key} items={[home, ...items]} contact={contact} />
    </>
  )
}
