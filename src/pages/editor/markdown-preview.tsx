import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Box, Text, Flex } from '@vtex/brand-ui'
import CopyButton from 'components/copy-button'
import { ResizeIcon } from '@vtexdocs/components'
import PageHeader from 'components/page-header'
import type { Page } from 'utils/typings/types'
import image from '../../../public/images/editor.png'

import { MarkdownRenderer } from '@vtexdocs/components'
import { serialize } from 'next-mdx-remote/serialize'

import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'
import remarkMermaid from 'utils/remark_plugins/mermaid'
import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'

import styles from 'styles/document-editor'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

interface Props {
  isPRPreview: boolean
  isPreview: boolean
}

import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import Editor from 'react-simple-code-editor'

const templateDoc = `---
title: "Markdown & Mermaid Preview"
slug: "preview-document-slug"
hidden: false
createdAt: "2026-03-06T10:00:00.000Z"
updatedAt: "2026-03-06T10:00:00.000Z"
excerpt: "Test markdown rendering and mermaid diagrams"
---

## Mermaid Diagram Test

Below is a simple flowchart:

\`\`\`mermaid
flowchart TB
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> A
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    User->>Browser: Request Page
    Browser->>Server: HTTP Request
    Server->>Browser: HTML Response
    Browser->>User: Render Page
\`\`\`

## Regular Markdown Content

### Subtitle

Text Template: Lorem ipsum dolor sit amet, consectetur adipiscing elit.

[📣 Link Example](https://help.vtex.com/)

## Bullet points

- First item
  - subtopic
- **Second (Bold)** item
- *Third (Italic)* item
- \`Fourth (Code)\` item

**Code Block**

\`\`\`json
{
  "test": "value",
  "number": 123
}
\`\`\`

## Table

| Name | Description |
| :---: | --- |
|\`VTEX\` | Help Center content |
| [Help Center](https://help.vtex.com) | Documentation portal |

>❗ This is a Danger callout.

>⚠ This is a Warning callout.

>✅ This is a Success callout.

>ℹ️ This is an Info callout.
`

async function serializing(
  document: string
): Promise<{ serialized: MDXRemoteSerializeResult | null; error: string }> {
  let serialized, serializedError
  try {
    serialized = await serialize(document, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGFM,
          remarkBlockquote,
          remarkMermaid,
          remarkReadingTime,
        ],
        rehypePlugins: [
          [rehypeHighlight, { languages: { hljsCurl }, ignoreMissing: true }],
        ],
        format: 'mdx',
        development: process.env.NODE_ENV === 'development',
      },
    })
    serialized = JSON.parse(JSON.stringify(serialized))
  } catch (e) {
    serializedError = (e as Error).message
  }
  return { serialized, error: serializedError || '' }
}

const MarkdownPreviewPage: Page<Props> = () => {
  const [documentContent, setDocumentContent] = useState(templateDoc)
  const [serializedDoc, setSerializedDoc] =
    useState<MDXRemoteSerializeResult | null>()
  const [error, setError] = useState('')
  const [resizeValue, setResizeValue] = useState(0)

  const missingProperties = () => {
    const frontmatterKeys = [
      'title',
      'slug',
      'hidden',
      'createdAt',
      'updatedAt',
      'excerpt',
    ]
    const missing = frontmatterKeys.filter(
      (key) => !serializedDoc?.frontmatter?.hasOwnProperty(key)
    )
    let result = ''
    for (let i = 0, n = missing.length; i < n; i++) {
      result += missing[i] + `${i < n - 1 ? ', ' : ''}`
    }
    return result
  }

  const resizeHandler = (mouseDownEvent: MouseEvent) => {
    const startPosition = mouseDownEvent.pageX
    mouseDownEvent.preventDefault()

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      setResizeValue(
        (resizeValue > 0 ? resizeValue : startPosition + 24) +
          (mouseMoveEvent.pageX - startPosition)
      )
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove)
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp, { once: true })
  }

  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll()
    }
    highlight()
  }, [])

  useEffect(() => {
    let active = true
    load()
    return () => {
      active = false
    }

    async function load() {
      if (!active) {
        return
      }
      const { serialized, error } = await serializing(documentContent)
      setError(error)
      setSerializedDoc(serialized)
    }
  }, [documentContent])

  return (
    <>
      <Head>
        <title>Markdown Preview</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Box sx={styles.previewContainer}>
        <PageHeader
          title="Markdown Preview"
          description="Use the markdown editor below and preview the rendered page to the side."
          imageUrl={image}
          imageAlt="Markdown Preview"
        />
        <Flex sx={styles.writeBox}>
          <Box
            style={resizeValue > 0 ? { width: resizeValue } : null}
            sx={styles.writeContainer}
          >
            <Flex
              sx={styles.resizeButton}
              onMouseDown={(e: MouseEvent) => resizeHandler(e)}
            >
              <ResizeIcon />
            </Flex>
            <Box sx={styles.textArea}>
              <CopyButton sx={styles.copyButton} code={documentContent} />
              <Editor
                placeholder="Type here..."
                value={documentContent}
                onValueChange={(code) => setDocumentContent(code)}
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.markdown, 'md')
                    .split('\n')
                    .map(
                      (line) =>
                        `<span class="editor-line-number">${line}</span>`
                    )
                    .join('\n')
                }
                padding={10}
                style={styles.editor}
              />
            </Box>
          </Box>
          <Box
            style={
              resizeValue > 0
                ? { width: `calc(100% - ${resizeValue}px)` }
                : null
            }
            sx={styles.renderedPageBox}
          >
            {serializedDoc && (
              <Box sx={styles.articleBox}>
                <article>
                  <header>
                    {missingProperties() ? (
                      <Text sx={styles.warning}>
                        {`{ ${missingProperties()} }`} is missing in
                        Frontmatter!
                      </Text>
                    ) : null}
                    <Text sx={styles.documentationTitle} className="title">
                      {serializedDoc.frontmatter?.title}
                    </Text>
                    <Text sx={styles.documentationExcerpt}>
                      {serializedDoc.frontmatter?.excerpt}
                    </Text>
                  </header>
                  <MarkdownRenderer serialized={serializedDoc} />
                </article>
              </Box>
            )}
            {error && (
              <Flex sx={styles.errorBox}>
                <Text sx={styles.errorMessage}>{error}</Text>
              </Flex>
            )}
            {!documentContent && (
              <Text sx={styles.emptyMessage}>Empty Document</Text>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  )
}

MarkdownPreviewPage.hideSidebar = true

export default MarkdownPreviewPage
