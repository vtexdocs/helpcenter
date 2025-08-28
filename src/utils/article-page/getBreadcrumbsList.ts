export function getBreadcrumbsList(
  breadcrumbList: { slug: string; name: string; type: string }[],
  parents: string[],
  parentsNames: string[],
  parentsTypes: string[],
  docsType:
    | 'tutorials'
    | 'tracks'
    | 'announcements'
    | 'faq'
    | 'known-issues'
    | 'troubleshooting'
) {
  parentsNames.forEach((_el: string, idx: number) => {
    breadcrumbList.push({
      slug: `/docs/${docsType}/${parents[idx]}`,
      name: parentsNames[idx],
      type: parentsTypes[idx] || 'defaultType',
    })
  })
  return breadcrumbList
}
