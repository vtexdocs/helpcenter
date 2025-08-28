import { Box, Flex, Link, Text } from '@vtex/brand-ui'
import Breadcrumb from 'components/breadcrumb'

import FeedbackSection from 'components/feedback-section'

import styles from 'styles/documentation-page'
import { useIntl } from 'react-intl'
import Head from 'next/head'

interface ArticleIndexingDataI {
  name: string
  children: { name: string; slug: string }[]
  hidePaginationPrevious: boolean
  hidePaginationNext: boolean
  type: string
}

export interface ArticleIndexingProps {
  articleData: ArticleIndexingDataI
}

const ArticleIndexing = ({ ...props }) => {
  const intl = useIntl()
  return (
    <>
      <Head>
        <meta name="docsearch:doctype" content="tracks" />
        <title>{props.name || 'Untitled'}</title>
        <meta name="docsearch:doctitle" content={props.name || 'Untitled'} />
      </Head>
      <Flex sx={styles.innerContainer}>
        <Box sx={styles.articleBox}>
          <Box sx={styles.contentContainer}>
            <article>
              <header style={{ all: 'unset' }}>
                {props.breadcrumbList.length > 0 ? (
                  <Breadcrumb breadcrumbList={props.breadcrumbList} />
                ) : undefined}
              </header>
              <Box sx={styles.textContainer}>
                <Box sx={styles.titleContainer}>
                  <Text>{props.name || 'Untitled'}</Text>
                </Box>
                <Box sx={styles.indexContainer}>
                  <Text sx={{ fontSize: '22px', pt: '32px' }}>
                    {intl.formatMessage({
                      id: 'tutorials.in_this_section',
                      defaultMessage: 'In this section',
                    })}
                  </Text>
                  <Flex sx={styles.linksContainer}>
                    {props?.children?.map(
                      (el: { slug: string; name: string }) => (
                        <Link href={el.slug} key={el.slug}>
                          {el.name || 'Untitled'}
                        </Link>
                      )
                    )}
                  </Flex>
                </Box>
              </Box>
            </article>
          </Box>
          <FeedbackSection slug={props.slug} suggestEdits={false} />
        </Box>
      </Flex>
    </>
  )
}

export default ArticleIndexing
