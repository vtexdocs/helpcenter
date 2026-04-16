import Link from 'next/link'
import { Box, Flex, Text } from '@vtex/brand-ui'

import styles from './styles'
import { cardContainer, cardTitle, titleContainer } from './functions'
import { CardProps } from 'utils/typings/types'
const DocumentationCard = ({
  title,
  description,
  link,
  containerType,
  Icon,
  onClick,
}: CardProps) => {
  return (
    <Link href={link} legacyBehavior>
      <a onClick={onClick} style={{ width: '100%' }}>
        <Box sx={cardContainer(containerType)}>
          <Flex sx={titleContainer(containerType)}>
            {Icon && <Icon size={24} sx={{ color: '#4A596B' }} />}
            <Text className="title" sx={cardTitle(containerType)}>
              {title}
            </Text>
          </Flex>
          <Text className="description" sx={styles.description}>
            {description}
          </Text>
        </Box>
      </a>
    </Link>
  )
}

export default DocumentationCard
