import fs from 'fs'
import path from 'path'
// import { enumerateNavigation } from './enumerate-navigation'

export default async function getNavigation() {
  // For server-side only: read from file system to avoid bundling
  // This prevents the 3.4MB navigation from being bundled with client code
  try {
    const filePath = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const navigation = JSON.parse(fileContent)
    return navigation.navbar
  } catch (error) {
    // Fallback to environment URL if file read fails
    console.warn(
      'Failed to read navigation.json from filesystem, falling back to URL'
    )
    const navigationJsonUrl =
      process.env.navigationJsonUrl ||
      'https://leafy-mooncake-7c2e5e.netlify.app/navigation.json'

    const result = await fetch(navigationJsonUrl)
    const data = await result.json()
    return data.navbar
  }
}
