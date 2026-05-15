#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const DEFAULT_URL =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
const JSDELIVR_URL =
  'https://cdn.jsdelivr.net/gh/vtexdocs/help-center-content@main/public/navigation.json'
const STATICALLY_URL =
  'https://cdn.statically.io/gh/vtexdocs/help-center-content/main/public/navigation.json'

async function fetchNavigationData() {
  const primaryUrl =
    process.env.NAVIGATION_JSON_URL ||
    process.env.navigationJsonUrl ||
    DEFAULT_URL
  const urls = [
    ...new Set([primaryUrl, DEFAULT_URL, JSDELIVR_URL, STATICALLY_URL]),
  ]

  let lastError = null
  for (const url of urls) {
    try {
      console.log(`[validate-navigation] Trying: ${url}`)
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log(`[validate-navigation] Success: ${url}`)
        return data
      }
      console.warn(`[validate-navigation] Failed (${response.status}): ${url}`)
    } catch (err) {
      console.warn(`[validate-navigation] Error: ${url} - ${err.message}`)
      lastError = err
    }
  }
  throw lastError || new Error('All navigation fetch sources failed')
}

async function main() {
  try {
    const data = await fetchNavigationData()

    if (!data.navbar) {
      throw new Error('Navigation data missing "navbar" property')
    }
    if (!Array.isArray(data.navbar) || data.navbar.length === 0) {
      throw new Error('Navigation data has empty "navbar" array')
    }

    const targetPath = path.join(process.cwd(), 'public', 'navigation.json')
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`[validate-navigation] Written to ${targetPath}`)
  } catch (error) {
    console.error(`[validate-navigation] FAILED: ${error.message}`)
    console.error(
      '[validate-navigation] Build cannot proceed without navigation data.'
    )
    process.exit(1)
  }
}

main()
