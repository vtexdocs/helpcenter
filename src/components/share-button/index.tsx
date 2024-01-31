import { Box, Button, Flex, Text } from '@vtex/brand-ui'
import FacebookIcon from 'components/icons/facebook-icon'
import LinkedinIcon from 'components/icons/linkedin-icon'
import ShareIcon from 'components/icons/share-icon'
import TwitterIcon from 'components/icons/twitter-icon'
import { useState } from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share'
import styles from './styles'

interface Props {
  url: string
}

const ShareButton = ({ url }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch (error) {
      console.error('Error copying link to clipboard:', error)
    }
  }

  return (
    <Flex sx={styles.container}>
      <Button
        sx={styles.button}
        variant="tertiary"
        icon={ShareIcon}
        onClick={() => setIsOpen(!isOpen)}
      ></Button>
      {isOpen && (
        <Flex sx={styles.innerContainer}>
          <Flex sx={styles.innerButton} onClick={handleCopyLink}>
            <ShareIcon />
            <Text>Copy link</Text>
          </Flex>
          <Box sx={styles.divider}></Box>
          <TwitterShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <TwitterIcon size={24} />
              <Text>Twitter</Text>
            </Flex>
          </TwitterShareButton>
          <FacebookShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <FacebookIcon size={24} />
              <Text>Facebook</Text>
            </Flex>
          </FacebookShareButton>
          <LinkedinShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <LinkedinIcon size={24} />
              <Text>LinkedIn</Text>
            </Flex>
          </LinkedinShareButton>
        </Flex>
      )}
    </Flex>
  )
}

export default ShareButton
