import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { heroContent } from '../content/homepageContent'
import testimonials from '../content/testimonials.json'
import { Button, Section } from './Primitives'

const profile = heroContent.links.find(({ label }) => label === 'LinkedIn')
const trackId = 'recommendation-cards'

export default function Recommendations() {
  const trackRef = useRef<HTMLOListElement>(null)
  const [edge, setEdge] = useState<'start' | 'end' | 'middle'>('start')

  function updateEdge(track: HTMLOListElement) {
    const remaining = track.scrollWidth - track.clientWidth - track.scrollLeft
    setEdge(track.scrollLeft <= 1 ? 'start' : remaining <= 1 ? 'end' : 'middle')
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const resize = new ResizeObserver(() => updateEdge(track))
    resize.observe(track)
    return () => resize.disconnect()
  }, [])

  function move(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return
    const [first, second] = track.children as HTMLCollectionOf<HTMLElement>
    track.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft) })
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
        track.scrollTo({ left: 0 })
        break
      case 'End':
        track.scrollTo({ left: track.scrollWidth })
        break
      default:
        return
    }
    event.preventDefault()
  }

  if (!profile) throw new Error('Missing LinkedIn profile link')

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
        onScroll={(event) => updateEdge(event.currentTarget)}
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
                <p className="metadata">{item.companyContext}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <a className="text-link recommendation-profile" href={profile.href}>
        Find the full recommendations on LinkedIn
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </Section>
  )
}
