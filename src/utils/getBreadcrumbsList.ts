export function getBreadcrumbsList(
  parents: string[],
  parentsNames: string[],
  parentsTypes: string[]
) {
  const breadcrumbs: { slug: string; name: string; type: string }[] = []
  parentsNames.forEach((_el: string, idx: number) => {
    breadcrumbs.push({
      slug: `/docs/tutorial/${parents[idx]}`,
      name: parentsNames[idx],
      type: parentsTypes[idx],
    })
  })
  return breadcrumbs
}
