import { Hit } from 'react-instantsearch-core'

export const getBreadcrumbs = (hit: Hit) => {
  const breadcrumbs: string[] = []
  breadcrumbs.push(hit.doctype)
  breadcrumbs.push(hit.doctitle)
  return breadcrumbs
}

export const getRelativeURL = (url: string) => {
  const relativeURL = url.replace(/^(?:\/\/|[^/]+)*\//, '')
  return '/' + relativeURL
}
