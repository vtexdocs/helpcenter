import fs from 'fs'
import path from 'path'
// import { enumerateNavigation } from './enumerate-navigation'

export default async function getNavigation() {
  // Prefer environment URL to allow fetching from external repo
  const envUrl = process.env.navigationJsonUrl
  if (envUrl) {
    try {
      const result = await fetch(envUrl)
      if (!result.ok) {
        throw new Error(
          `Failed to fetch navigation from env URL: ${result.status}`
        )
      }
      const data = await result.json()
      return data.navbar
    } catch (e) {
      console.warn(
        'getNavigation: failed to fetch from env URL, falling back to filesystem',
        e
      )
    }
  }

  // Filesystem fallback (server-side only)
  try {
    const filePath = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const navigation = JSON.parse(fileContent)
    return navigation.navbar
  } catch (error) {
    // Final fallback to default external URL (help-center-content)
    console.warn(
      'getNavigation: filesystem read failed, falling back to default URL'
    )
    const navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const result = await fetch(navigationJsonUrl)
    const data = await result.json()
    return data.navbar
  }
}
