import Link from 'next/link'
import { Flex, Text } from '@vtex/brand-ui'

import type { FaqDataElement } from 'utils/typings/types'
import Tooltip from 'components/tooltip'
import styles from './styles'
import { useEffect, useRef, useState } from 'react'

const FaqSectionCard = ({
  Icon,
  title,
  description,
  type,
  link,
}: FaqDataElement) => {
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
          <Flex className="typeContainer" sx={styles.typeContainer}>
            <Icon className="icon" sx={styles.icon} />
            <Text className="type" sx={styles.type}>
              {type}
            </Text>
          </Flex>
          <Flex sx={styles.infoContainer}>
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
        </Flex>
      </Link>
    </Tooltip>
  )
}

export default FaqSectionCard