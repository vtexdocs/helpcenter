import { Box, Flex, Link, Text } from '@vtex/brand-ui'
import Breadcrumb from 'components/breadcrumb'

import FeedbackSection from 'components/feedback-section'
import startHereImage from '../../../public/images/start-here.png'
import PageHeader from 'components/page-header'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import { useIntl } from 'react-intl'

const TutorialIndexing = ({ ...props }) => {
  const intl = useIntl()

  return (
    <>
      <PageHeader
        title={intl.formatMessage({
          id: 'tutorials_landing_page.title',
        })}
        description={intl.formatMessage({
          id: 'tutorials_landing_page.description',
        })}
        imageUrl={startHereImage}
        imageAlt={intl.formatMessage({
          id: 'tutorials_landing_page.title',
        })}
      />
      <Flex sx={styles.innerContainer}>
        <Box sx={styles.articleBox}>
          <Box sx={styles.contentContainer}>
            <article>
              <header style={{ all: 'unset' }}>
                {props.breadcrumbList.length > 1 ? (
                  <Breadcrumb breadcrumbList={props.breadcrumbList} />
                ) : undefined}
              </header>
              <Box sx={styles.textContainer}>
                <Box sx={styles.titleContainer}>
                  <Text>{props.name || 'Untitled'}</Text>
                </Box>
                <Box sx={styles.indexContainer}>
                  <Text sx={{ fontSize: '22px', pt: '32px' }}>
                    In this section
                  </Text>
                  <Flex sx={styles.linksContainer}>
                    {props.children.map(
                      (el: { slug: string; name: string }) => (
                        <Link href={el.slug}>{el.name || 'Untitled'}</Link>
                      )
                    )}
                  </Flex>
                </Box>
              </Box>
            </article>
          </Box>
          <FeedbackSection slug={props.slug} suggestEdits={false} />
          {props.isListed && (
            <ArticlePagination
              hidePaginationNext={props.hidePaginationNext || false}
              hidePaginationPrevious={props.hidePaginationPrevious || false}
              pagination={props.pagination}
            />
          )}
        </Box>
      </Flex>
    </>
  )
}

export default TutorialIndexing
