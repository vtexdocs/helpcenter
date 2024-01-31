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
  EmailShareButton,
} from 'react-share'
import styles from './styles'
import EmailIcon from 'components/icons/email-icon'
import CopyIcon from 'components/icons/copy-icon'

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
    <Flex sx={styles.container} onMouseLeave={() => setIsOpen(false)}>
      <Button
        sx={styles.button}
        variant="tertiary"
        icon={ShareIcon}
        onClick={() => setIsOpen(!isOpen)}
      ></Button>
      {isOpen && (
        <Flex sx={styles.innerContainer}>
          <Flex sx={styles.innerButton} onClick={handleCopyLink}>
            <CopyIcon size={16} />
            <Text>Copy link</Text>
          </Flex>
          <Box sx={styles.divider}></Box>
          <EmailShareButton url={url}>
            <Flex sx={styles.innerButton} onClick={handleCopyLink}>
              <EmailIcon size={16} />
              <Text>E-mail</Text>
            </Flex>
          </EmailShareButton>
          <TwitterShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <TwitterIcon size={16} />
              <Text>Twitter</Text>
            </Flex>
          </TwitterShareButton>
          <FacebookShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <FacebookIcon size={16} />
              <Text>Facebook</Text>
            </Flex>
          </FacebookShareButton>
          <LinkedinShareButton url={url}>
            <Flex sx={styles.innerButton}>
              <LinkedinIcon size={16} />
              <Text>LinkedIn</Text>
            </Flex>
          </LinkedinShareButton>
        </Flex>
      )}
    </Flex>
  )
}

export default ShareButton
