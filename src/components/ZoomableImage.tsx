import { Maximize2 } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import ImageLightbox from './ImageLightbox'

export type LightboxImage = {
  publicPath: string
  alt: string
  width: number
  height: number
  caption?: ReactNode
}

export default function ZoomableImage({
  image,
  group = [image],
  groupCaption,
  className = '',
  loading,
  fetchPriority,
}: {
  image: LightboxImage
  group?: LightboxImage[]
  groupCaption?: ReactNode
  className?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high'
}) {
  const [opener, setOpener] = useState<HTMLButtonElement | null>(null)

  return (
    <>
      <button
        type="button"
        className={`image-trigger ${className}`}
        style={
          {
            '--image-width': `${image.width}px`,
            '--image-ratio': image.width / image.height,
          } as CSSProperties
        }
        aria-label={`Enlarge image: ${image.alt}`}
        aria-haspopup="dialog"
        onClick={(event) => setOpener(event.currentTarget)}
      >
        <img
          src={import.meta.env.BASE_URL + image.publicPath}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={loading === 'lazy' ? 'async' : undefined}
        />
        <span className="image-enlarge-icon" aria-hidden="true">
          <Maximize2 size={16} />
        </span>
      </button>
      {opener && (
        <ImageLightbox
          images={group}
          initialIndex={group.indexOf(image)}
          groupCaption={groupCaption}
          opener={opener}
          onDismiss={() => setOpener(null)}
        />
      )}
    </>
  )
}
