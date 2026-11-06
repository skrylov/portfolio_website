import { Outlet, useLocation, useNavigationType } from 'react-router'
import { useEffect, useRef } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { Container } from './Primitives'

function scrollToAnchor(target: HTMLElement, smooth: boolean) {
  const align = () => target.scrollIntoView({ behavior: 'instant' })
  if (
    !smooth ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    align()
    return
  }

  const start = window.scrollY
  const offset =
    Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const destination = start + target.getBoundingClientRect().top - offset
  const max = document.documentElement.scrollHeight - window.innerHeight
  const end = Math.max(0, Math.min(destination, max))
  if (Math.abs(end - start) < 1) {
    align()
    return
  }

  const duration = 300
  const startedAt = performance.now()
  const listeners = new AbortController()
  let frame = 0
  function stop() {
    cancelAnimationFrame(frame)
    listeners.abort()
  }
  function tick(now: number) {
    const progress = Math.min(1, (now - startedAt) / duration)
    if (progress === 1) {
      align()
      stop()
      return
    }
    const eased = progress * progress * (3 - 2 * progress)
    window.scrollTo({ top: start + (end - start) * eased, behavior: 'instant' })
    frame = requestAnimationFrame(tick)
  }

  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    window.addEventListener(event, stop, {
      passive: true,
      signal: listeners.signal,
    })
  }
  frame = requestAnimationFrame(tick)
  return stop
}

export default function Layout() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)

  useEffect(() => {
    // The router owns scrolling so browser history cannot override anchor alignment.
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useEffect(() => {
    const samePage = previousPath.current === pathname
    previousPath.current = pathname
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1
      target.focus({ preventScroll: true })
      return scrollToAnchor(target, samePage && navigationType !== 'POP')
    } else window.scrollTo(0, 0)
  }, [pathname, hash, key, navigationType])
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
