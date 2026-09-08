import Link from 'next/link'
import { useRouter } from 'next/router'
import { Flex, Text, Box } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import styles from './styles'

interface Props {
  pagination: {
    previousDoc: {
      slug: string | null
      name: string | null
    }
    nextDoc: {
      slug: string | null
      name: string | null
    }
  }
  hidePaginationPrevious: boolean
  hidePaginationNext: boolean
}

const ArticlePagination = ({
  pagination,
  hidePaginationNext,
  hidePaginationPrevious,
}: Props) => {
  const intl = useIntl()
  const { locale } = useRouter()

  const showPrevious =
    !hidePaginationPrevious &&
    Boolean(pagination?.previousDoc?.slug) &&
    Boolean(pagination?.previousDoc?.name)
  const showNext =
    !hidePaginationNext &&
    Boolean(pagination?.nextDoc?.slug) &&
    Boolean(pagination?.nextDoc?.name)

  return (
    <Box as="nav" sx={styles.mainContainer}>
      <Flex sx={styles.flexContainer}>
        {showPrevious && (
          <Box sx={styles.paginationLinkPrevious}>
            <Link
              style={styles.linkReset}
              href={pagination.previousDoc.slug as string}
              locale={locale}
            >
              <Box sx={styles.paginationBox}>
                <Text sx={styles.subTitle}>
                  {`« ${intl.formatMessage({
                    id: 'article_pagination.previous',
                    defaultMessage: 'Previous',
                  })}`}
                </Text>
                <Text sx={styles.paginationText}>
                  {pagination.previousDoc.name}
                </Text>
              </Box>
            </Link>
          </Box>
        )}

        {showNext && (
          <Box sx={styles.paginationLinkNext}>
            <Link
              style={styles.linkReset}
              href={pagination.nextDoc.slug as string}
              locale={locale}
            >
              <Box sx={styles.paginationBoxNext}>
                <Text sx={styles.subTitle}>
                  {`${intl.formatMessage({
                    id: 'article_pagination.next',
                    defaultMessage: 'Next',
                  })} »`}
                </Text>
                <Text sx={styles.paginationText}>
                  {pagination.nextDoc.name}
                </Text>
              </Box>
            </Link>
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default ArticlePagination
