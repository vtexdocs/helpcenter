import Link from 'next/link'
import { Flex, Text } from '@vtex/brand-ui'

import type { DocDataElement } from 'utils/typings/types'
import Tooltip from 'components/tooltip'
import styles from './styles'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import LongArrowIcon from 'components/icons/long-arrow-icon'

const SupportSectionCard = ({
  Icon,
  title,
  description,
  link,
  isExternalLink = false,
}: DocDataElement) => {
  const intl = useIntl()
  const [tooltipState, setTooltipState] = useState(false)
  const [tooltipDescription, setTooltipDescription] = useState(description)
  const descriptionRef = useRef<HTMLElement>()

  useEffect(() => {
    const resizeObserver = new MutationObserver(function (entries) {
      const target = entries[0].target as HTMLElement
      if (target.offsetHeight < target.scrollHeight) setTooltipState(true)
      else setTooltipState(false)
      setTooltipDescription(target.innerText)
    })
    if (descriptionRef.current) {
      resizeObserver.observe(descriptionRef.current, {
        childList: true,
      })
    }
    return () => {
      resizeObserver.disconnect
    }
  }, [descriptionRef.current])

  return (
    <Tooltip placement="top" label={tooltipDescription} isCard={tooltipState}>
      <Link href={link} legacyBehavior>
        <Flex sx={styles.cardContainer}>
          <Flex className="titleContainer" sx={styles.titleContainer}>
            <Icon sx={styles.icon} />
            <Text className="title" sx={styles.title}>
              {title}
            </Text>
          </Flex>
          <Flex sx={styles.infoContainer}>
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
    </Tooltip>
  )
}

export default SupportSectionCard
