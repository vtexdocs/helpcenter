import Image from 'next/image'
import Head from 'next/head'
import type { Page } from 'utils/typings/types'
import { Box, Flex, Text, Button, Link } from '@vtex/brand-ui'
import styles from 'styles/error-page'
import fourOhFourImage from '../../public/images/404-illustration.png'
import { GetStaticProps } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getFeedbackURL } from 'utils/get-url'
import { useRouter } from 'next/router'

interface Props {
  branch: string
}

const FourOhFour: Page<Props> = ({ branch }) => {
  const router = useRouter()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const currentPage = router.asPath.split('?')[0]
  const feedbackUrl = `${getFeedbackURL()}https://help.vtex.com${currentPage}&entry.358925425=Page+not+found`

  return (
    <>
      <Head>
        <title>404 - Page not found</title>
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/404-illustration.png" />
      </Head>
      <Box sx={styles.mainContainer}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.contentText}>
            <Text sx={styles.title}>
              The content you are looking for was not found or does not exist
              anymore
            </Text>
            <Text sx={styles.description}>
              Search above to find what you need or contact us to report an
              error.
            </Text>
            <Button sx={styles.button}>
              <Link sx={styles.buttonLink} href={feedbackUrl}>
                CONTACT US
              </Link>
            </Button>
          </Box>
          <Box sx={styles.content}>
            <Image
              alt="404 error"
              src={fourOhFourImage}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({
  preview,
  previewData,
}) => {
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  return {
    props: {
      branch,
    },
  }
}

export default FourOhFour
