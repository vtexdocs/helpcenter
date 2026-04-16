import getNavigation from '../getNavigation'
import { flattenJSON, getKeyByValue } from '../navigation-utils'

type SidebarMetadataOptions = {
  branch?: string
}

export async function getSidebarMetadata(
  sectionSelected: string,
  slug: string,
  options: SidebarMetadataOptions = {}
) {
  const sidebar = await getNavigation({ branch: options.branch })
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
