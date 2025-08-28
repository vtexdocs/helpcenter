import { capitalizeFirstLetter } from 'utils/string-utils'
import { getIcon } from 'utils/constants'

import { DocumentProps } from 'components/documentation-card'

const getTitleFromUrl = (url: string) => {
  const words = url.split('#')[0].split('-')
  return `${words.map(capitalizeFirstLetter).join(' ')}`
}

export const createDocFromUrl = (doc: {
  url: string
  title: string
  category: string
}): DocumentProps => {
  const Icon = getIcon(doc.category)
  const title = getTitleFromUrl(doc.title)

  return {
    title,
    Icon,
    description: getTitleFromUrl(doc.category),
    link: doc.url,
  }
}
