import Link from 'next/link'
import { Flex, Text } from '@vtex/brand-ui'

import type { FaqDataElement } from 'utils/typings/types'
import styles from './styles'
import { Tag } from '@vtexdocs/components'

const cardLinkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  height: '100%',
  width: '100%',
} as const

const FaqSectionCard = ({
  title,
  description,
  productTeam,
  link,
}: FaqDataElement) => {
  return (
    <Link href={link} style={cardLinkStyle}>
      <Flex sx={styles.cardContainer}>
        <Flex sx={styles.typeContainer}>
          <Tag color={'Gray'}>{productTeam}</Tag>
        </Flex>
        <Flex sx={styles.infoContainer}>
          <Text className="title" sx={styles.title}>
            {title}
          </Text>
          <Text className="description" sx={styles.description}>
            {description}
          </Text>
        </Flex>
      </Flex>
    </Link>
  )
}

export default FaqSectionCard
