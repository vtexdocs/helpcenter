import { toCamelCase } from './string-utils'

const HTMLBlockRegex = /<([a-z-]+)(.+?)style="([^"]+)"([^>]*)>(.*?)<\/\1>/g
const selfClosingHTMLTagRegex = /<([a-z-]+)(.+?)style="([^"]+)"(.*?)\/>/g

const getStyleObject: (styleValue: string) => string = (styleValue) => {
  const styleProps = styleValue.split(';')
  const styles = styleProps.map((styleProp: string) => {
    if (!styleProp || styleProp.trim() === '') return null
    const [attribute, value] = styleProp.split(':')
    if (!attribute || !value) return null
    return `${toCamelCase(attribute.trim())}: "${value.trim()}"`
  })
  return `{ ${styles.join(', ')} }`
}

const HTMLBlockReplacer: (
  _match: string,
  tag: string,
  stylePrefix: string,
  styleValue: string,
  styleSuffix: string,
  blockContent: string
) => string = (
  _match,
  tag,
  stylePrefix,
  styleValue,
  styleSuffix,
  blockContent
) => {
  const styleObject = getStyleObject(styleValue)
  return `<${tag}${stylePrefix}style={${styleObject}}${styleSuffix}>${blockContent}</${tag}>`
}

const selfClosingHTMLTagReplacer: (
  _match: string,
  tag: string,
  stylePrefix: string,
  styleValue: string,
  styleSuffix: string
) => string = (_match, tag, stylePrefix, styleValue, styleSuffix) => {
  const styleObject = getStyleObject(styleValue)
  return `<${tag}${stylePrefix}style={${styleObject}}${styleSuffix}/>`
}

const convertCalloutToMarkdown = (markdownContent: string): string => {
  const calloutMap: Record<string, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '❗',
  }

  return markdownContent.replace(
    /<div\s+[^>]*class\s*=\s*"alert alert-(info|warning|danger)"[^>]*>([\s\S]*?)<\/div>/gi,
    (_: string, type: string, inner: string): string => {
      const emoji = calloutMap[type] || ''
      return inner
        .trim()
        .split('\n')
        .map((line: string) => `> ${emoji} ${line.trim()}`)
        .join('\n')
    }
  )
}

const replaceHTMLBlocks: (content: string) => string = (content) => {
  content = convertCalloutToMarkdown(content)
  return content
    .replace(/<div\s+style="[^"]*">\s*([\s\S]*?)\s*<\/div>/gi, (_, content) => {
      const trimmed = content.trim().replace(/\n/g, '\n> ')
      return `> ${trimmed}`
    })
    .replace(/<p>([\s\S]*?)<\/p>/gi, (_, inner) =>
      inner.trim() ? `${inner.trim()}\n\n` : ''
    )
    .replace(/\s*style="[^"]*"/gi, '') // <-- Removes all style="..." attributes
    .replace(/<>/g, '\\<\\>')
    .replace(/<br>/g, '<br />')
    .replace(/<!--.*?-->/gs, '')
    .replace(HTMLBlockRegex, HTMLBlockReplacer)
    .replace(selfClosingHTMLTagRegex, selfClosingHTMLTagReplacer)
    .replace(
      /<code>(.*?)<\/code>/gs,
      (_, codeContent) => `\`${codeContent.trim()}\``
    )
}

export default replaceHTMLBlocks
