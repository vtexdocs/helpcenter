export function getBreadcrumbsList(
  parents: string[],
  parentsNames: string[],
  parentsTypes: string[],
  docsType: 'tutorials' | 'tracks'
) {
  const breadcrumbs: { slug: string; name: string; type: string }[] = []
  parentsNames.forEach((_el: string, idx: number) => {
    breadcrumbs.push({
      slug: `/docs/${docsType}/${parents[idx]}`,
      name: parentsNames[idx],
      type: parentsTypes[idx] || 'defaultType',
    })
  })
  return breadcrumbs
}
