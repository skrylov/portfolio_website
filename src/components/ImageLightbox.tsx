import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react'
import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { LightboxImage } from './ZoomableImage'

type Point = { x: number; y: number }
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
const midpoint = (a: Point, b: Point) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
})
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export default function ImageLightbox({
  images,
  initialIndex,
  groupCaption,
  opener,
  onDismiss,
}: {
  images: LightboxImage[]
  initialIndex: number
  groupCaption?: ReactNode
  opener: HTMLButtonElement
  onDismiss: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const picture = useRef<HTMLImageElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const pinch = useRef<{ distance: number; zoom: number; image: Point } | null>(
    null,
  )
  const anchor = useRef<{ image: Point; client: Point } | null>(null)
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const image = images[index]
  const fit = Math.min(1, size.width / image.width, size.height / image.height)
  const maxZoom = Math.max(4, 2 / fit)

  useLayoutEffect(() => {
    const modal = dialog.current!
    const stage = viewport.current!
    modal.showModal()
    closeButton.current?.focus()
    function measure() {
      setSize({ width: stage.clientWidth, height: stage.clientHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => {
      observer.disconnect()
      modal.close()
      opener.focus({ preventScroll: true })
    }
  }, [opener])

  useLayoutEffect(() => {
    const target = anchor.current
    if (!target) return
    anchor.current = null
    const bounds = picture.current!.getBoundingClientRect()
    viewport.current!.scrollBy({
      left: bounds.left + target.image.x * bounds.width - target.client.x,
      top: bounds.top + target.image.y * bounds.height - target.client.y,
      behavior: 'instant',
    })
  }, [zoom])

  function imagePoint(point: Point) {
    const bounds = picture.current!.getBoundingClientRect()
    return {
      x: clamp((point.x - bounds.left) / bounds.width, 0, 1),
      y: clamp((point.y - bounds.top) / bounds.height, 0, 1),
    }
  }

  function changeZoom(value: number) {
    const next = clamp(value, 1, maxZoom)
    if (next === zoom) return
    const stage = viewport.current!.getBoundingClientRect()
    const point = {
      x: stage.left + stage.width / 2,
      y: stage.top + stage.height / 2,
    }
    anchor.current = { image: imagePoint(point), client: point }
    setZoom(next)
  }

  function stepImage(direction: number) {
    const next = index + direction
    if (next < 0 || next >= images.length) return
    anchor.current = null
    setIndex(next)
    setZoom(1)
    viewport.current!.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pointers.current.size >= 2) return
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
    event.currentTarget.setPointerCapture(event.pointerId)
    const [first, second] = pointers.current.values()
    if (second) {
      pinch.current = {
        distance: Math.max(1, distance(first, second)),
        zoom,
        image: imagePoint(midpoint(first, second)),
      }
    }
  }

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const point = { x: event.clientX, y: event.clientY }
    pointers.current.set(event.pointerId, point)
    const other = [...pointers.current.entries()].find(
      ([id]) => id !== event.pointerId,
    )?.[1]
    const gesture = pinch.current
    if (other && gesture) {
      anchor.current = { image: gesture.image, client: midpoint(point, other) }
      setZoom(
        clamp(
          (gesture.zoom * distance(point, other)) / gesture.distance,
          1,
          maxZoom,
        ),
      )
    } else {
      event.currentTarget.scrollBy({
        left: previous.x - point.x,
        top: previous.y - point.y,
        behavior: 'instant',
      })
    }
  }

  function endPan(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Tab') {
      const controls = event.currentTarget.querySelectorAll<HTMLElement>(
        'button, [tabindex="0"], a[href]',
      )
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return
    switch (event.key) {
      case '+':
      case '=':
        changeZoom(zoom * 1.5)
        break
      case '-':
        changeZoom(zoom / 1.5)
        break
      case '0':
        changeZoom(1)
        break
      case 'PageUp':
        stepImage(-1)
        break
      case 'PageDown':
        stepImage(1)
        break
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown': {
        const x =
          event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
        const y =
          event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0
        if (zoom > 1)
          viewport.current!.scrollBy({
            left: x * 80,
            top: y * 80,
            behavior: 'instant',
          })
        else if (x) stepImage(x)
        else return
        break
      }
      default:
        return
    }
    event.preventDefault()
  }

  return createPortal(
    <dialog
      ref={dialog}
      className="image-lightbox"
      aria-label="Image viewer"
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
    >
      <div className="lightbox-layout">
        <div className="lightbox-toolbar">
          <div className="lightbox-controls">
            <button
              type="button"
              ref={closeButton}
              aria-label="Close image viewer"
              onClick={onDismiss}
            >
              <X size={20} aria-hidden="true" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  aria-disabled={index === 0}
                  onClick={() => stepImage(-1)}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  aria-disabled={index === images.length - 1}
                  onClick={() => stepImage(1)}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
                <span className="lightbox-position" role="status">
                  {index + 1} / {images.length}
                  <span className="sr-only"> · {image.alt}</span>
                </span>
              </>
            )}
          </div>
          <div className="lightbox-controls">
            <button
              type="button"
              aria-label="Zoom out"
              aria-disabled={zoom === 1}
              onClick={() => changeZoom(zoom / 1.5)}
            >
              <Minus size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Fit image"
              onClick={() => changeZoom(1)}
            >
              Fit
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              aria-disabled={zoom >= maxZoom}
              onClick={() => changeZoom(zoom * 1.5)}
            >
              <Plus size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="lightbox-viewport"
          ref={viewport}
          role="region"
          tabIndex={0}
          aria-label="Image viewport. Use arrow keys to pan when zoomed."
          onPointerDown={startPan}
          onPointerMove={movePointer}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          onLostPointerCapture={endPan}
        >
          <div className="lightbox-canvas">
            <img
              ref={picture}
              src={import.meta.env.BASE_URL + image.publicPath}
              alt={image.alt}
              draggable={false}
              style={{
                width: image.width * fit * zoom,
                height: image.height * fit * zoom,
              }}
            />
          </div>
        </div>
        {(image.caption || groupCaption) && (
          <div className="lightbox-caption caption">
            {image.caption}
            {groupCaption}
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  )
}
