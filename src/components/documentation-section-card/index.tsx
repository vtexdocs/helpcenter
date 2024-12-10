import Link from 'next/link'
import { Flex, Text } from '@vtex/brand-ui'

import type { DocDataElement } from 'utils/typings/types'
import styles from './styles'
import { useRef } from 'react'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'
import LongArrowIcon from 'components/icons/long-arrow-icon'

const DocumentationSectionCard = ({
  Icon,
  title,
  description,
  link,
  isExternalLink = false,
}: DocDataElement) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]
  const descriptionRef = useRef<HTMLElement>()

  return (
    <Link href={link}>
      <Flex sx={styles.cardContainer}>
        <Flex sx={styles.infoContainer}>
          <Icon sx={styles.icon} />
          <Text className="title" sx={styles.title}>
            {title}
          </Text>
          <Text
            ref={descriptionRef}
            className="description"
            sx={styles.description}
          >
            {description}
          </Text>
        </Flex>
        <Flex
          className="quickStartedContainer"
          sx={styles.quickStartedContainer}
        >
          {!isExternalLink ? (
            <Text className="learnMoreText" sx={styles.learnMoreText}>
              {messages['landing_page_documentation_card.learnMoreText']}
            </Text>
          ) : (
            <Flex sx={styles.accessPortal}>
              <Text className="accessPortal" sx={styles.learnMoreText}>
                {messages['landing_page_documentation_card.accessPortal']}
              </Text>
              <LongArrowIcon size={18} />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Link>
  )
}

export default DocumentationSectionCard
