import getNavigation from './getNavigation'
import { flattenJSON, getKeyByValue } from './navigation-utils'

export async function getSidebarMetadata(
  sectionSelected: string,
  slug: string
) {
  const sidebar = await getNavigation()
  const filtered = sidebar.find(
    (item: { documentation: string }) => item.documentation === sectionSelected
  )
  const flat = flattenJSON(filtered)
  const keyPath = getKeyByValue(flat, slug) as string

  return {
    keyPath,
    flattenedSidebar: flat,
    sidebarfallback: filtered,
  }
}
