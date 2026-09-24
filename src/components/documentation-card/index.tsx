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
      <a
        onClick={onClick}
        style={{
          width: '100%',
          height: containerType === 'see-also' ? '100%' : undefined,
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Box sx={cardContainer(containerType)}>
          <Flex sx={titleContainer(containerType)}>
            {Icon && (
              <Flex sx={styles.seeAlsoIcon}>
                <Icon size={18} sx={{ color: '#4A596B' }} />
              </Flex>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Text className="title" sx={cardTitle(containerType)}>
                {title}
              </Text>
              <Text className="description" sx={styles.description}>
                {description}
              </Text>
            </Box>
          </Flex>
        </Box>
      </a>
    </Link>
  )
}

export default DocumentationCard
