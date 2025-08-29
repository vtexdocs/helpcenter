export function getBreadcrumbsList(
  breadcrumbList: { slug: string; name: string; type: string }[],
  parents: string[],
  parentsNames: string[],
  parentsTypes: string[],
  docsType: string
) {
  parentsNames.forEach((_el: string, idx: number) => {
    breadcrumbList.push({
      slug: `/${docsType}/${parents[idx]}`,
      name: parentsNames[idx],
      type: parentsTypes[idx] || 'defaultType',
    })
  })
  return breadcrumbList
}
