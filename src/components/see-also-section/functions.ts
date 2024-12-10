import { capitalizeFirstLetter } from 'utils/string-utils'
import { getIcon } from 'utils/constants'

import { DocumentProps } from 'components/documentation-card'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

const getDoctype = (category: string) => {
  switch (category) {
    case 'Tutorials':
      return 'Tutorials'
    case 'Start here':
      return 'Start here'
    case 'Announcements':
      return 'Announcements'
    default:
      return 'Tutorials'
  }
}

const getTitleFromUrl = (url: string) => {
  const words = url.split('#')[0].split('-')
  return `${words.map(capitalizeFirstLetter).join(' ').replace('Api', 'API')}`
}

export const createDocFromUrl = (doc: {
  url: string
  title: string
  category: string
}): DocumentProps => {
  const locale = useContext(LibraryContext).locale
  const Icon = getIcon(getDoctype(doc.category), locale)!
  const title = getTitleFromUrl(doc.title)

  return {
    title,
    Icon,
    description: getTitleFromUrl(doc.category),
    link: doc.url,
  }
}
