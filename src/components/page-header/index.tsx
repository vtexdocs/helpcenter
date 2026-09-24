import Image, { StaticImageData } from 'next/image'
import { Box, Flex, Text } from '@vtex/brand-ui'
import styles from './styles'
import { Fragment } from 'react'

interface IPageHeader {
  title: string
  description: string
  descriptionLine2?: string
  imageUrl: StaticImageData
  imageAlt: string
  priority?: boolean
  longDescription?: boolean
}

const PageHeader = ({
  title,
  description,
  descriptionLine2,
  imageUrl,
  imageAlt,
  priority = false,
  longDescription = false,
}: IPageHeader) => {
  return (
    <Fragment>
      <Box sx={styles.welcomeOuterContainer}>
        <Flex sx={styles.welcomeInnerContainer}>
          <Box
            sx={
              longDescription ? styles.welcomeHeaderLong : styles.welcomeHeader
            }
          >
            <Text sx={styles.welcomeText}>{title}</Text>
            <Text
              sx={
                longDescription
                  ? styles.welcomeSubtitleLong
                  : styles.welcomeSubtitle
              }
            >
              {description}
            </Text>
            {descriptionLine2 && (
              <Text
                sx={
                  longDescription
                    ? styles.welcomeSubtitleLongSecondParagraph
                    : styles.welcomeSubtitle
                }
              >
                {descriptionLine2}
              </Text>
            )}
          </Box>
          <Box sx={styles.welcomeImageOuterContainer}>
            <Box sx={styles.welcomeImageInnerContainer}>
              <Box sx={styles.welcomeImageGradient}></Box>
              <Image
                alt={imageAlt}
                src={imageUrl}
                priority={priority}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Box>
        </Flex>
      </Box>
      <Box sx={styles.divider}></Box>
    </Fragment>
  )
}

export default PageHeader
