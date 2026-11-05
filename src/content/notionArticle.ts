export type Inline =
  | string
  | { kind: 'strong' | 'emphasis'; children: Inline[] }
  | { kind: 'link'; href: string; children: Inline[] }
  | { kind: 'mention'; href: string }

type Column = { line: number; ratio: number; blocks: ArticleBlock[] }

export type ArticleBlock = { line: number } & (
  | { kind: 'paragraph'; content: Inline[] }
  | { kind: 'heading'; level: number; content: Inline[] }
  | { kind: 'list'; start?: number; items: Inline[][] }
  | { kind: 'columns'; columns: Column[] }
  | { kind: 'callout'; icon: string; blocks: ArticleBlock[] }
  | { kind: 'toggle'; label: Inline[]; blocks: ArticleBlock[] }
  | { kind: 'image'; source: string }
  | { kind: 'separator' | 'empty' }
)

type Reject = (message: string) => never

function parseInline(
  text: string,
  reject: Reject,
  insideLink = false,
): Inline[] {
  const tokens =
    /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~])|(<[bi]>|<\/[bi]>|\*\*|\*)|<mention url="([^"]+)"\s*\/>|(?<!!)\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|<[/!?A-Za-z]|!\[|`|\]\(/g
  let offset = 0

  function readUntil(end?: string): Inline[] {
    const result: Inline[] = []
    for (let token = tokens.exec(text); token; token = tokens.exec(text)) {
      const [match, escaped, emphasis, mention, label, href] = token
      if (token.index > offset) result.push(text.slice(offset, token.index))
      offset = tokens.lastIndex
      if (match === end) return result

      if (escaped) {
        result.push(escaped)
      } else if (emphasis && !emphasis.startsWith('</')) {
        const strong = emphasis === '<b>' || emphasis === '**'
        const closing = emphasis.startsWith('<')
          ? '</' + emphasis.slice(1)
          : emphasis
        result.push({
          kind: strong ? 'strong' : 'emphasis',
          children: readUntil(closing),
        })
      } else if ((mention || href) && !insideLink) {
        const url = mention || href
        if (
          !/^(https?:\/\/|mailto:)/i.test(url) ||
          /[\s\p{Cc}]/u.test(url) ||
          !URL.canParse(url)
        ) {
          reject('Unsupported link destination: ' + url)
        }
        if (mention) result.push({ kind: 'mention', href: url })
        else
          result.push({
            kind: 'link',
            href: url,
            children: parseInline(label, reject, true),
          })
      } else {
        reject('Unsupported or unexpected inline markup: ' + match)
      }
    }
    if (end) reject('Expected closing inline marker ' + end)
    if (offset < text.length) result.push(text.slice(offset))
    return result
  }

  return readUntil()
}

const headingPattern = /^(#{1,6}) (.+)$/
const listPattern = /^(?:[-+*]|(\d+)\.) (.+)$/
const separatorPattern = /^(?:-{3,}|\*{3,}|_{3,})$/
const structuralLine =
  /^(?:<(?![bi]>|mention )|#{1,6} |[-+*] |\d+\. |\s|>|~{3}|\|)/
const columnPattern = /^<column ratio="(\d+)">$/

// The export is line-oriented. Each container consumes its own closing tag, so
// nesting is validated before any source text is rendered as React nodes.
export function parseNotionArticle(
  source: string,
  file: string,
): ArticleBlock[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  let cursor = 0

  function fail(line: number, message: string): never {
    throw new Error(file + ':' + line + ' — ' + message)
  }

  function inline(text: string, line: number) {
    return parseInline(text, (message) => fail(line, message))
  }

  function skipBlankLines() {
    while (cursor < lines.length && !lines[cursor].trim()) cursor++
  }

  function readColumns(line: number): Column[] {
    const columns: Column[] = []
    for (;;) {
      skipBlankLines()
      const current = lines[cursor++]
      if (current === '</columns>') {
        if (!columns.length) fail(line, 'Expected at least one column')
        return columns
      }
      const ratio = Number(current?.match(columnPattern)?.[1])
      if (!(ratio > 0 && ratio <= 100))
        fail(cursor, 'Expected a column or </columns>')
      columns.push({ line: cursor, ratio, blocks: readBlocks('</column>') })
    }
  }

  function readBlocks(end?: string): ArticleBlock[] {
    const blocks: ArticleBlock[] = []
    skipBlankLines()
    while (cursor < lines.length) {
      const text = lines[cursor++]
      const line = cursor
      if (text === end) return blocks

      const heading = text.match(headingPattern)
      const list = text.match(listPattern)
      const image = text.match(/^<image source="([^"]+)"\s*\/>$/)
      const callout = text.match(
        /^<callout icon="([^"]+)"(?: color="[^"]+")?>$/,
      )

      if (heading) {
        // The page title owns H1. Exported H1s become article sections.
        blocks.push({
          line,
          kind: 'heading',
          level: Math.max(2, heading[1].length),
          content: inline(heading[2], line),
        })
      } else if (separatorPattern.test(text)) {
        blocks.push({ line, kind: 'separator' })
      } else if (list) {
        const start = list[1] ? Number(list[1]) : undefined
        const items = [inline(list[2], line)]
        let item = lines[cursor]?.match(listPattern)
        while (item && Boolean(item[1]) === (start !== undefined)) {
          cursor++
          if (start !== undefined && Number(item[1]) !== start + items.length) {
            fail(cursor, 'Expected consecutive ordered list numbering')
          }
          items.push(inline(item[2], cursor))
          item = lines[cursor]?.match(listPattern)
        }
        blocks.push({ line, kind: 'list', start, items })
      } else if (image) {
        blocks.push({ line, kind: 'image', source: image[1] })
      } else if (callout) {
        blocks.push({
          line,
          kind: 'callout',
          icon: callout[1],
          blocks: readBlocks('</callout>'),
        })
      } else if (text === '<columns>') {
        blocks.push({ line, kind: 'columns', columns: readColumns(line) })
      } else if (text === '<toggle>') {
        const label = lines[cursor++]
        if (!label?.trim() || structuralLine.test(label))
          fail(cursor, 'Expected toggle label')
        blocks.push({
          line,
          kind: 'toggle',
          label: inline(label, cursor),
          blocks: readBlocks('</toggle>'),
        })
      } else if (/^<p\s*\/>$/.test(text)) {
        blocks.push({ line, kind: 'empty' })
      } else {
        if (structuralLine.test(text))
          fail(line, 'Unsupported or unexpected block: ' + text)
        let paragraph = text
        while (
          lines[cursor]?.trim() &&
          !structuralLine.test(lines[cursor]) &&
          !separatorPattern.test(lines[cursor])
        ) {
          paragraph += '\n' + lines[cursor++]
        }
        blocks.push({
          line,
          kind: 'paragraph',
          content: inline(paragraph, line),
        })
      }
      skipBlankLines()
    }
    if (end) fail(cursor, 'Expected ' + end + ' before end of article')
    return blocks
  }

  return readBlocks()
}
