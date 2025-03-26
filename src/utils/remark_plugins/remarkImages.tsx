import { visit } from 'unist-util-visit'
import { getPlaiceholder } from 'plaiceholder'
import probe from 'probe-image-size'
import { Node } from 'unist'
import retry from '../retry-util'
import { getLogger } from '../logging/log-util'

const logger = getLogger('remarkImages')

// Default configuration for image processing
const DEFAULT_CONFIG = {
  // Maximum dimensions for applying plaiceholder (to avoid processing very large images)
  maxImageSizePx: 1500,
  // Retry configuration for probe-image-size
  probeRetryOptions: {
    maxRetries: 3,
    initialDelay: 500,
    maxDelay: 5000,
    timeout: 10000,
    operationName: 'probe-image-size',
  },
  // Retry configuration for plaiceholder
  placeholderRetryOptions: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    timeout: 20000,
    operationName: 'plaiceholder',
  },
}

interface ImageNode extends Node {
  url: string | Buffer
  alt: string
}

/**
 * Creates a remark plugin that processes images to be compatible with @vtexdocs/components ImageComponent
 * - Gets image dimensions using probe-image-size
 * - Generates low-resolution placeholders using plaiceholder
 * - Formats alt text as JSON with image metadata
 *
 * @param config Configuration options for the plugin
 * @returns A remark plugin function
 */
export function remarkImages(config: typeof DEFAULT_CONFIG = DEFAULT_CONFIG) {
  return async function transformer(tree: Node) {
    const promises: Promise<void>[] = []
    const { maxImageSizePx, probeRetryOptions, placeholderRetryOptions } = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    visit(tree, 'image', (node: ImageNode) => {
      const imageUrl = node.url as string

      // Process each image with proper error handling
      promises.push(
        (async () => {
          try {
            // 1. Initial setup - create placeholder JSON with empty values
            node.alt = JSON.stringify({
              base64: '  ',
              img: {
                width: null,
                height: null,
                type: null,
                src: imageUrl,
              },
            })

            // 2. Get image dimensions with retry
            const dimensions = await retry(() => probe(imageUrl), {
              ...probeRetryOptions,
              operationName: `probe:${imageUrl.split('?')[0]}`,
              onRetry: (error, attempt, delay) => {
                logger.warn(
                  `[probe] Failed to get dimensions for ${
                    imageUrl.split('?')[0]
                  }, ` +
                    `retry ${attempt + 1}/${
                      probeRetryOptions.maxRetries
                    } in ${Math.round(delay / 1000)}s - ${error}`
                )
              },
            })

            // 3. Update alt with image dimensions
            node.alt = JSON.stringify({
              base64: '  ',
              img: dimensions,
            })

            // 4. For reasonably sized images, try to get plaiceholder data
            if (
              dimensions.width < maxImageSizePx &&
              dimensions.height < maxImageSizePx
            ) {
              try {
                const placeholderData = await retry(
                  async () => getPlaiceholder(imageUrl),
                  {
                    ...placeholderRetryOptions,
                    operationName: `plaiceholder:${imageUrl.split('?')[0]}`,
                    onRetry: (error, attempt, delay) => {
                      logger.warn(
                        `[plaiceholder] Failed to generate placeholder for ${
                          imageUrl.split('?')[0]
                        }, ` +
                          `retry ${attempt + 1}/${
                            placeholderRetryOptions.maxRetries
                          } in ${Math.round(delay / 1000)}s - ${error}`
                      )
                    },
                    // Only retry network and temporary errors, not image format issues
                    shouldRetry: (error) => {
                      const errorMessage = String(error)
                      // Don't retry on image format/decoding errors
                      if (
                        errorMessage.includes('unsupported image format') ||
                        errorMessage.includes('could not decode') ||
                        errorMessage.includes('invalid image')
                      ) {
                        logger.info(
                          `Skipping retries for ${imageUrl} due to format issue: ${errorMessage}`
                        )
                        return false
                      }
                      return true
                    },
                  }
                )

                // 5. Update with complete data including base64 placeholder
                node.alt = JSON.stringify({
                  base64: placeholderData.base64,
                  img: placeholderData.img,
                })

                logger.debug(
                  `Successfully processed image: ${imageUrl.split('?')[0]}`
                )
              } catch (error) {
                // Keep the existing dimensions but log the error
                logger.warn(
                  `Failed to generate plaiceholder for ${
                    imageUrl.split('?')[0]
                  }: ${error}`
                )
              }
            } else {
              logger.info(
                `Skipping plaiceholder for large image ${
                  imageUrl.split('?')[0]
                } (${dimensions.width}x${dimensions.height})`
              )
            }
          } catch (error) {
            // If all attempts fail, ensure we have a valid JSON in alt
            logger.error(
              `Failed to process image ${imageUrl.split('?')[0]}: ${error}`
            )
            node.alt = JSON.stringify({
              base64: '',
              img: {
                width: null,
                height: null,
                type: null,
                src: imageUrl,
                alt: node.alt, // preserve original alt text
              },
            })
          }
        })()
      )
    })

    // Wait for all image processing to complete
    await Promise.all(
      promises.map((p) =>
        p.catch((error) => {
          logger.error(`Unhandled error in image processing: ${error}`)
        })
      )
    )
  }
}

export default remarkImages
