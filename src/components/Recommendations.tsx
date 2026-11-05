import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import testimonials from '../content/testimonials.json'
import { Button, Section } from './Primitives'

const recommendationsUrl =
  'https://www.linkedin.com/in/s-krylov/details/recommendations/'
const trackId = 'recommendation-cards'

// Issue #29 standardizes the displayed attribution while preserving the audit source.
const companyLabel = (context: string) =>
  context.replace(/\bCreditstar\b(?! Group\b)/g, 'Creditstar Group')

const maxScroll = (track: HTMLElement) => track.scrollWidth - track.clientWidth
const snapTolerance = 1
function edgeAt(track: HTMLElement, position = track.scrollLeft) {
  if (position <= snapTolerance) return 'start'
  if (maxScroll(track) - position <= snapTolerance) return 'end'
  return 'middle'
}

export default function Recommendations() {
  const trackRef = useRef<HTMLOListElement>(null)
  const pendingSnap = useRef<number | null>(null)
  const [edge, setEdge] = useState<'start' | 'end' | 'middle'>('start')

  const releaseSnap = useCallback((track: HTMLOListElement) => {
    pendingSnap.current = null
    setEdge(edgeAt(track))
  }, [])

  function onScroll(track: HTMLOListElement) {
    const target = pendingSnap.current
    if (target === null || Math.abs(track.scrollLeft - target) <= snapTolerance)
      releaseSnap(track)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const resize = new ResizeObserver(() => releaseSnap(track))
    resize.observe(track)
    return () => resize.disconnect()
  }, [releaseSnap])

  function scrollToSnap(track: HTMLOListElement, left: number) {
    pendingSnap.current = left
    setEdge(edgeAt(track, left))
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    track.scrollTo({ left, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  function move(direction: -1 | 1) {
    const track = trackRef.current
    const first = track?.firstElementChild
    if (!track || !first) return
    const origin = first.getBoundingClientRect().left
    const limit = maxScroll(track)
    const positions = Array.from(track.children, (card) =>
      Math.min(limit, card.getBoundingClientRect().left - origin),
    )
    // Rapid presses advance from the requested card while the track is moving.
    const from = pendingSnap.current ?? track.scrollLeft
    if (direction < 0) positions.reverse()
    const target = positions.find(
      (position) => direction * (position - from) > snapTolerance,
    )
    if (target !== undefined) scrollToSnap(track, target)
  }

  function onTrackKey(event: KeyboardEvent<HTMLOListElement>) {
    if (
      event.target !== event.currentTarget ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return
    const track = event.currentTarget
    switch (event.key) {
      case 'ArrowLeft':
        move(-1)
        break
      case 'ArrowRight':
        move(1)
        break
      case 'Home':
        scrollToSnap(track, 0)
        break
      case 'End':
        scrollToSnap(track, maxScroll(track))
        break
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <Section id="recommendations" aria-labelledby="recommendations-heading">
      <div className="recommendation-header">
        <div>
          <p className="eyebrow">LinkedIn</p>
          <h2 id="recommendations-heading">Recommendations</h2>
        </div>
        <div className="recommendation-controls">
          <Button
            className="button-secondary"
            aria-label="Previous recommendation"
            aria-controls={trackId}
            aria-disabled={edge === 'start'}
            onClick={() => {
              if (edge !== 'start') move(-1)
            }}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </Button>
          <Button
            className="button-secondary"
            aria-label="Next recommendation"
            aria-controls={trackId}
            aria-disabled={edge === 'end'}
            onClick={() => {
              if (edge !== 'end') move(1)
            }}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </Button>
        </div>
      </div>
      <ol
        id={trackId}
        ref={trackRef}
        className="recommendation-track"
        role="list"
        aria-label="Recommendation cards"
        tabIndex={0}
        onScroll={(event) => onScroll(event.currentTarget)}
        onPointerDown={(event) => releaseSnap(event.currentTarget)}
        onWheel={(event) => releaseSnap(event.currentTarget)}
        onFocus={(event) => {
          if (event.target !== event.currentTarget)
            releaseSnap(event.currentTarget)
        }}
        onKeyDown={onTrackKey}
      >
        {testimonials.map((item) => (
          <li key={item.linkedInUrl}>
            <figure className="recommendation-card">
              <Quote
                className="recommendation-mark"
                size={22}
                aria-hidden="true"
              />
              <blockquote>
                <p>{item.excerpt}</p>
              </blockquote>
              <figcaption>
                <a className="text-link" href={item.linkedInUrl}>
                  {item.name}
                </a>
                <p className="metadata">{item.title}</p>
                <p className="metadata">{companyLabel(item.companyContext)}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <a className="text-link recommendation-profile" href={recommendationsUrl}>
        Find the full recommendations on LinkedIn
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </Section>
  )
}
