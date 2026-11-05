import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { ArticleBlock, Inline } from '../content/notionArticle'
import media from '../content/media.json'
import references from '../content/references.json'

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

function ArticleImage({ entry }: { entry: Media }) {
  if (entry.status !== 'migrated' || !entry.publicPath)
    throw new Error('Missing local case-study image: ' + entry.id)
  return (
    <img
      src={import.meta.env.BASE_URL + entry.publicPath}
      alt={entry.alt}
      width={entry.width}
      height={entry.height}
      loading={entry.line === 1 ? 'eager' : 'lazy'}
      decoding="async"
    />
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
          <Heading>
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
        rendered = (
          <Columns className="case-wide">
            <div className="case-columns">
              {block.columns.map(({ line, ratio, blocks }) => (
                <div className="case-flow" key={line} style={{ flex: ratio }}>
                  <BlockNodes blocks={blocks} images={images} />
                </div>
              ))}
            </div>
            {figcaption}
          </Columns>
        )
        break
      }
      case 'image': {
        const entry = images.get(block.source)
        if (!entry)
          throw new Error('Unmapped case-study image at line ' + block.line)
        rendered = (
          <figure className="case-wide case-image">
            <ArticleImage entry={entry} />
            {(entry.sourceCaption || caption) && (
              <figcaption className="caption">
                {entry.sourceCaption && <p>{entry.sourceCaption}</p>}
                {caption && <InlineNodes content={caption.content} />}
              </figcaption>
            )}
          </figure>
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
