import { Box, Flex, IconCaret, Text, Link } from '@vtex/brand-ui'

import type { WhatsNextDataElementTutorial } from 'utils/typings/types'

import styles from '../styles'

const WhatsNextCardTutorial = ({
  title,
  linkTitle,
  linkTo,
}: WhatsNextDataElementTutorial) => {
  return (
    <Link href={linkTo} sx={styles.container}>
      <Box>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Flex sx={styles.linkContainer}>
          <Text sx={styles.link} className="link">
            {linkTitle}
          </Text>
          <IconCaret
            className="caret"
            color="#A1A8B3"
            direction="right"
            size={16}
          />
        </Flex>
      </Box>
    </Link>
  )
}

export default WhatsNextCardTutorial
