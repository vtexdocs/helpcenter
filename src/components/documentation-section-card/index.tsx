import Link from 'next/link'
import { Flex, Text } from '@vtex/brand-ui'

import type { DocDataElement } from 'utils/typings/types'
import styles from './styles'
import { useRef } from 'react'
import { useIntl } from 'react-intl'
import { LongArrowIcon } from '@vtexdocs/components'

const cardLinkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flex: 1,
  minWidth: 0,
} as const

const DocumentationSectionCard = ({
  Icon,
  title,
  description,
  link,
  isExternalLink = false,
}: DocDataElement) => {
  const intl = useIntl()
  const descriptionRef = useRef<HTMLElement>()

  return (
    <Link
      href={link}
      target={isExternalLink ? '_blank' : '_self'}
      style={cardLinkStyle}
    >
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
              {intl.formatMessage({
                id: 'landing_page_documentation_card.learnMoreText',
              })}
            </Text>
          ) : (
            <Flex sx={styles.accessPortal}>
              <Text className="accessPortal" sx={styles.learnMoreText}>
                {intl.formatMessage({
                  id: 'landing_page_documentation_card.accessPortal',
                })}
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
