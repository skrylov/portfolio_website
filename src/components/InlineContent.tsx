import { Fragment } from 'react'

// Render the small inline vocabulary used by hero.md and metrics.md as React
// nodes. Never inject exported HTML or execute source markup.
export default function InlineContent({ text }: { text: string }) {
  return text.split(/(<b>.*?<\/b>|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const bold = part.match(/^<b>(.*?)<\/b>$/)
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    const unescape = (value: string) => value.replace(/\\~/g, '~')
    if (bold) return <strong key={index}>{unescape(bold[1])}</strong>
    if (link)
      return (
        <a key={index} className="text-link" href={link[2]}>
          {link[1]}
        </a>
      )
    return <Fragment key={index}>{unescape(part)}</Fragment>
  })
}
