import { Link, Grid, Text, Box } from '@vtex/brand-ui'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
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

import styles from './styles'

const ArticlePagination = ({
  pagination,
  hidePaginationNext,
  hidePaginationPrevious,
}: Props) => {
  const router = useRouter()
  const intl = useIntl()

  const handleClick = (e: { preventDefault: () => void }, slug: string) => {
    e.preventDefault()
    router.push(`${slug}`)
  }
  return (
    <Box sx={styles.mainContainer}>
      <Grid sx={styles.flexContainer}>
        {!hidePaginationPrevious &&
          pagination?.previousDoc?.slug &&
          pagination?.previousDoc?.name && (
            <Link
              sx={styles.paginationLinkPrevious}
              href={pagination?.previousDoc?.slug}
              onClick={(e: { preventDefault: () => void }) => {
                handleClick(e, pagination.previousDoc.slug as string)
              }}
            >
              <Box sx={styles.paginationBox}>
                <Text sx={styles.paginationText}>
                  {pagination?.previousDoc?.name}
                </Text>
                <Text sx={styles.subTitle}>
                  {`« ${intl.formatMessage({
                    id: 'article_pagination.previous',
                    defaultMessage: 'Previous',
                  })}`}
                </Text>
              </Box>
            </Link>
          )}
        {!hidePaginationNext &&
          pagination?.nextDoc?.slug &&
          pagination?.nextDoc?.name && (
            <Link
              sx={styles.paginationLinkNext}
              href={pagination?.nextDoc?.slug}
              onClick={(e: { preventDefault: () => void }) => {
                handleClick(e, pagination?.nextDoc?.slug as string)
              }}
            >
              <Box
                sx={
                  !hidePaginationPrevious
                    ? styles.paginationBox
                    : styles.justNext
                }
              >
                <Text sx={styles.paginationText}>
                  {pagination?.nextDoc?.name}
                </Text>
                <Text sx={styles.subTitle}>
                  {`${intl.formatMessage({
                    id: 'article_pagination.next',
                    defaultMessage: 'Next',
                  })} »`}
                </Text>
              </Box>
            </Link>
          )}
      </Grid>
    </Box>
  )
}

export default ArticlePagination
