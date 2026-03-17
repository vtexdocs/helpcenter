import fs from 'fs'
import path from 'path'

const DEFAULT_URL =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
const JSDELIVR_URL =
  'https://cdn.jsdelivr.net/gh/vtexdocs/help-center-content@main/public/navigation.json'
const STATICALLY_URL =
  'https://cdn.statically.io/gh/vtexdocs/help-center-content/main/public/navigation.json'

export async function fetchNavigationData(): Promise<Record<string, unknown>> {
  const primaryUrl =
    process.env.NAVIGATION_JSON_URL ||
    process.env.navigationJsonUrl ||
    DEFAULT_URL
  const urls = [
    ...new Set([primaryUrl, DEFAULT_URL, JSDELIVR_URL, STATICALLY_URL]),
  ]

  let lastError: Error | null = null

  for (const url of urls) {
    try {
      console.log(`[validate-navigation] Trying: ${url}`)
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log(`[validate-navigation] Success: ${url}`)
        return data as Record<string, unknown>
      }
      console.warn(`[validate-navigation] Failed (${response.status}): ${url}`)
    } catch (err) {
      console.warn(
        `[validate-navigation] Error: ${url} - ${(err as Error).message}`
      )
      lastError = err as Error
    }
  }

  throw lastError || new Error('All navigation fetch sources failed')
}

export async function validateNavigation(outputPath?: string): Promise<void> {
  const data = await fetchNavigationData()

  if (!data.navbar) {
    throw new Error('Navigation data missing "navbar" property')
  }

  if (!Array.isArray(data.navbar) || data.navbar.length === 0) {
    throw new Error('Navigation data has empty "navbar" array')
  }

  const targetPath =
    outputPath || path.join(process.cwd(), 'public', 'navigation.json')
  const jsonContent = JSON.stringify(data, null, 2)
  fs.writeFileSync(targetPath, jsonContent, 'utf-8')
  console.log(
    `[validate-navigation] Written to ${targetPath} (${jsonContent.length} bytes)`
  )
}
