import Image from 'next/image'
import Head from 'next/head'
import type { Page } from 'utils/typings/types'
import { Box, Flex, Text, Button, Link } from '@vtex/brand-ui'
import styles from 'styles/error-page'
import fiveHundredImage from '../../public/images/500-illustration.png'
import { GetStaticProps } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'

interface Props {
  branch: string
}

const FiveHundredPage: Page<Props> = ({ branch }) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)

  return (
    <>
      <Head>
        <title>500 - Internal Server Error</title>
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/500-illustration.png" />
      </Head>
      <Box sx={styles.mainContainer}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.contentText}>
            <Text sx={styles.title}>500 - Internal server error</Text>
            <Text sx={styles.description}>
              Sorry, there was an error on this page. Please try again later or
              contact us if the problem persists.
            </Text>
            <Button sx={styles.button}>
              <Link
                sx={styles.buttonLink}
                href="https://docs.google.com/forms/d/e/1FAIpQLSfmnotPvPjw-SjiE7lt2Nt3RQgNUe10ixXZmuO2v9enOJReoQ/viewform?entry.1972292648=developers.vtex.com&entry.1799503232="
              >
                CONTACT US
              </Link>
            </Button>
          </Box>
          <Box sx={styles.content}>
            <Image
              alt="500 error"
              src={fiveHundredImage}
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

export default FiveHundredPage
