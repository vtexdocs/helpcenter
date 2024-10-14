export function getBreadcrumbsList(
  parents: string[],
  parentsNames: string[],
  parentsTypes: string[],
  docsType: 'tutorial' | 'tracks',
  locale?: string
) {
  const breadcrumbs: { slug: string; name: string; type: string }[] = []
  parentsNames.forEach((_el: string, idx: number) => {
    breadcrumbs.push({
      slug: `${locale}/docs/${docsType}/${parents[idx]}`,
      name: parentsNames[idx],
      type: parentsTypes[idx] || 'defaultType',
    })
  })
  return breadcrumbs
}
