import { visit } from 'unist-util-visit'
import { getPlaiceholder } from 'plaiceholder'
import probe from 'probe-image-size'
import fs from 'fs'
import path from 'path'

const maxIMGSizePx = 1500

// Helper function to check if file exists
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

// Helper function to resolve image path
function resolveImagePath(url: string): string {
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Handle paths starting with '//' (protocol-relative)
  if (url.startsWith('//')) {
    return `https:${url}`
  }

  // Handle local paths
  if (url.startsWith('/')) {
    return path.join(process.cwd(), 'public', url)
  }

  return url
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function transformer(ast: any) {
  const promises: Promise<void>[] = []
  visit(ast, 'image', visitor)

  function visitor(node: { url: string | Buffer; alt: string }) {
    const imageUrl = node.url as string
    const resolvedPath = resolveImagePath(imageUrl)

    // For local files, check if they exist before processing
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
      if (!fileExists(resolvedPath)) {
        console.warn(`\x1b[33mWarning: Image not found: ${imageUrl}\x1b[0m`)
        // Set a fallback for missing images
        node.alt = JSON.stringify({
          base64: '',
          img: {
            src: imageUrl,
            width: 800,
            height: 600,
            type: 'image/png',
          },
        })
        return
      }
    }

    promises.push(
      probe(imageUrl)
        .then((results) => {
          const img = results
          node.alt = JSON.stringify({
            base64: '  ',
            img: img,
          })
          if (img.width < maxIMGSizePx && img.height < maxIMGSizePx) {
            promises.push(
              getPlaiceholder(node.url)
                .then((resultsPlaiceholder) => {
                  node.alt = JSON.stringify({
                    base64: resultsPlaiceholder.base64,
                    img: resultsPlaiceholder.img,
                  })
                })
                .catch((e) => {
                  console.warn(
                    `\x1b[33mWarning: Failed to generate placeholder for ${imageUrl}: ${e.message}\x1b[0m`
                  )
                  // Keep the basic image info without placeholder
                  node.alt = JSON.stringify({
                    base64: '',
                    img: img,
                  })
                })
            )
          }
        })
        .catch((e) => {
          console.warn(
            `\x1b[33mWarning: Failed to probe image ${imageUrl}: ${e.message}\x1b[0m`
          )
          // Set a basic fallback for images that can't be probed
          node.alt = JSON.stringify({
            base64: '',
            img: {
              src: imageUrl,
              width: 800,
              height: 600,
              type: 'image/png',
            },
          })
        })
    )
  }
  await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promises.map((p: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p.catch((e: any) =>
        console.warn(
          `\x1b[33mWarning: Image processing error: ${e.message}\x1b[0m`
        )
      )
    )
  )
}

function links() {
  return transformer
}

export default links
