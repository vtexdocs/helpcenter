import { Box } from '@vtex/brand-ui'

import DocumentationCard from 'components/documentation-card'
import {
  menuDocumentationData,
  menuSupportData,
  updatesData,
} from 'utils/constants'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import styles from './styles'

const DropdownMenu = () => {
  const locale = useContext(LibraryContext).locale
  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.innerContainer} data-cy="dropdown-menu">
        <Box
          sx={styles.documentationContainer}
          data-cy="dropdown-menu-first-section"
        >
          {menuDocumentationData(locale).map((card) => (
            <DocumentationCard
              containerType="dropdown"
              key={card.title}
              {...card}
            />
          ))}
        </Box>
        <Box
          sx={styles.updatesContainer}
          data-cy="dropdown-menu-second-section"
        >
          {menuSupportData(locale).map((card) => (
            <DocumentationCard
              containerType="dropdown"
              key={card.title}
              {...card}
            />
          ))}
        </Box>
        <Box
          sx={styles.updatesContainer}
          data-cy="dropdown-menu-second-section"
        >
          {updatesData(locale).map((card) => (
            <DocumentationCard
              containerType="dropdown"
              key={card.title}
              {...card}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default DropdownMenu
