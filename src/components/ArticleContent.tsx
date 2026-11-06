import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { ArticleBlock, Inline } from '../content/notionArticle'
import media from '../content/media.json'
import references from '../content/references.json'
import ZoomableImage, { type LightboxImage } from './ZoomableImage'
import { revealFocusedSlide } from './revealFocusedSlide'

type Media = (typeof media)[number]
type ArticleMedia = Map<string, Media>

function InlineNodes({ content }: { content: Inline[] }) {
  return content.map((node, index) => {
    if (typeof node === 'string') return <Fragment key={index}>{node}</Fragment>
    if (node.kind === 'strong')
      return (
        <strong key={index}>
          <InlineNodes content={node.children} />
        </strong>
      )
    if (node.kind === 'emphasis')
      return (
        <em key={index}>
          <InlineNodes content={node.children} />
        </em>
      )
    if (node.kind === 'link' || node.kind === 'mention') {
      const reference = references.pageMentions.find(
        (item) => item.sourceUrl === node.href,
      )
      const label =
        node.kind === 'link' ? (
          <InlineNodes content={node.children} />
        ) : (
          reference?.title
        )
      if (reference)
        return (
          <Link
            key={index}
            className="text-link"
            to={'/work/' + reference.slug}
          >
            {label}
          </Link>
        )
      if (node.kind === 'link')
        return (
          <a key={index} className="text-link" href={node.href}>
            {label}
          </a>
        )
      throw new Error('Unmapped case-study mention: ' + node.href)
    }
  })
}

type ImageBlock = Extract<ArticleBlock, { kind: 'image' }>
type CaptionBlock = Extract<ArticleBlock, { kind: 'paragraph' }>

function toSlide(
  block: ImageBlock,
  images: ArticleMedia,
  caption?: CaptionBlock,
): LightboxImage {
  const entry = images.get(block.source)
  if (!entry || entry.status !== 'migrated' || !entry.publicPath)
    throw new Error('Missing local case-study image at line ' + block.line)
  return {
    publicPath: entry.publicPath,
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    caption: (entry.sourceCaption || caption) && (
      <>
        {entry.sourceCaption && <p>{entry.sourceCaption}</p>}
        {caption && <InlineNodes content={caption.content} />}
      </>
    ),
  }
}

function ArticleFigure({
  group,
  index,
  groupCaption,
  eager,
}: {
  group: LightboxImage[]
  index: number
  groupCaption?: ReactNode
  eager?: boolean
}) {
  const image = group[index]
  // Large landscape media can use the wider rail when it is a top-level figure.
  const isWide = image.width >= 960 && image.width >= 1.5 * image.height
  return (
    <figure
      className={isWide ? 'case-image case-image-wide' : 'case-image'}
      style={
        {
          width: image.width,
          '--case-image-ratio': image.width / image.height,
        } as CSSProperties
      }
    >
      <ZoomableImage
        image={image}
        group={group}
        groupCaption={groupCaption}
        loading={eager ? 'eager' : 'lazy'}
      />
      {image.caption && (
        <figcaption className="caption">{image.caption}</figcaption>
      )}
    </figure>
  )
}
function captionAfter(
  block: ArticleBlock,
  next: ArticleBlock | undefined,
  images: ArticleMedia,
) {
  if (next?.kind !== 'paragraph') return
  if (block.kind === 'image') {
    const caption = images.get(block.source)?.adjacentCaption
    if (caption?.scope === 'image' && caption.line === next.line) return next
  }
  if (block.kind === 'columns') {
    const groupHasCaption = block.columns.some(({ blocks }) =>
      blocks.some((child) => {
        const caption =
          child.kind === 'image'
            ? images.get(child.source)?.adjacentCaption
            : undefined
        return caption?.scope === 'group' && caption.line === next.line
      }),
    )
    if (groupHasCaption) return next
  }
}

function imageRun(blocks: ArticleBlock[], start: number, images: ArticleMedia) {
  const group: LightboxImage[] = []
  const lines: number[] = []
  let captionLine: number | undefined
  let end = start
  for (let block = blocks[end]; block?.kind === 'image'; block = blocks[end]) {
    const next = captionAfter(block, blocks[end + 1], images)
    const caption = images.get(block.source)?.adjacentCaption
    if (caption?.scope === 'group') captionLine = caption.line
    group.push(toSlide(block, images, next))
    lines.push(block.line)
    end += next ? 2 : 1
  }
  const next = blocks[end]
  const caption =
    next?.kind === 'paragraph' && next.line === captionLine ? next : undefined
  return { group, lines, end: caption ? end + 1 : end, caption }
}
function BlockNodes({
  blocks,
  images,
}: {
  blocks: ArticleBlock[]
  images: ArticleMedia
}) {
  const result: ReactNode[] = []
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]
    if (block.kind === 'image') {
      const { group, lines, end, caption } = imageRun(blocks, index, images)
      if (group.length === 1) {
        result.push(
          <ArticleFigure
            key={block.line}
            group={group}
            index={0}
            eager={block.line === 1}
          />,
        )
      } else {
        const Gallery = caption ? 'figure' : 'div'
        const groupCaption = caption && (
          <InlineNodes content={caption.content} />
        )
        result.push(
          <Gallery className="case-group" key={block.line}>
            <div
              className="case-flow case-gallery"
              role="group"
              aria-label="Image gallery"
              onFocus={revealFocusedSlide}
            >
              {lines.map((line, index) => (
                <div key={line}>
                  <ArticleFigure
                    group={group}
                    index={index}
                    groupCaption={groupCaption}
                    eager={line === 1}
                  />
                </div>
              ))}
            </div>
            {groupCaption && (
              <figcaption className="caption">{groupCaption}</figcaption>
            )}
          </Gallery>,
        )
      }
      index = end - 1
      continue
    }
    const caption = captionAfter(block, blocks[index + 1], images)
    const figcaption = caption && (
      <figcaption className="caption">
        <InlineNodes content={caption.content} />
      </figcaption>
    )
    if (caption) index++

    let rendered: ReactNode
    switch (block.kind) {
      case 'paragraph':
        rendered = (
          <p>
            <InlineNodes content={block.content} />
          </p>
        )
        break
      case 'heading': {
        const Heading = ('h' + block.level) as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        rendered = (
          <Heading id={block.id}>
            <InlineNodes content={block.content} />
          </Heading>
        )
        break
      }
      case 'list': {
        const List = block.start === undefined ? 'ul' : 'ol'
        rendered = (
          <List start={block.start}>
            {block.items.map((item, index) => (
              <li key={index}>
                <InlineNodes content={item} />
              </li>
            ))}
          </List>
        )
        break
      }
      case 'callout':
        rendered = (
          <div className="case-callout">
            <span className="case-callout-icon" aria-hidden="true">
              {block.icon}
            </span>
            <div className="case-flow">
              <BlockNodes blocks={block.blocks} images={images} />
            </div>
          </div>
        )
        break
      case 'columns': {
        const Columns = caption ? 'figure' : 'div'
        const slides = block.columns.map(({ blocks }) => {
          const [first, next] = blocks
          if (first?.kind !== 'image') return
          const caption = captionAfter(first, next, images)
          if (blocks.length === (caption ? 2 : 1))
            return toSlide(first, images, caption)
        })
        const group =
          slides.length > 1 && slides.every((slide) => slide !== undefined)
            ? slides
            : undefined
        const groupCaption = caption && (
          <InlineNodes content={caption.content} />
        )
        rendered = (
          <Columns className="case-group">
            <div
              className={group ? 'case-columns case-gallery' : 'case-columns'}
              role={group ? 'group' : undefined}
              aria-label={group ? 'Image gallery' : undefined}
              onFocus={group ? revealFocusedSlide : undefined}
            >
              {block.columns.map(({ line, ratio, blocks }, index) => (
                <div className="case-flow" key={line} style={{ flex: ratio }}>
                  {group ? (
                    <ArticleFigure
                      group={group}
                      index={index}
                      groupCaption={groupCaption}
                    />
                  ) : (
                    <BlockNodes blocks={blocks} images={images} />
                  )}
                </div>
              ))}
            </div>
            {figcaption}
          </Columns>
        )
        break
      }
      case 'toggle':
        rendered = (
          <details className="case-toggle">
            <summary>
              <InlineNodes content={block.label} />
            </summary>
            <div className="case-flow">
              <BlockNodes blocks={block.blocks} images={images} />
            </div>
          </details>
        )
        break
      case 'separator':
        rendered = <hr />
        break
      case 'empty':
        rendered = <div className="case-empty" aria-hidden="true" />
        break
    }
    result.push(<Fragment key={block.line}>{rendered}</Fragment>)
  }
  return result
}

export default function ArticleContent({
  blocks,
  body,
}: {
  blocks: ArticleBlock[]
  body: string
}) {
  const images = new Map(
    media
      .filter((entry) => entry.contentFile === 'src/content/' + body)
      .map((entry) => [entry.source, entry]),
  )
  return (
    <div className="case-content case-flow">
      <BlockNodes blocks={blocks} images={images} />
    </div>
  )
}
