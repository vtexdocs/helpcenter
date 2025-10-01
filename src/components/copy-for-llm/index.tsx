import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import copy from 'copy-text-to-clipboard'

import CopyIcon from 'components/icons/copy-icon'
import styles from './styles'

interface Props {
  section:
    | 'tracks'
    | 'tutorials'
    | 'faq'
    | 'announcements'
    | 'known-issues'
    | 'troubleshooting'
  slug: string
}

const CopyForLLM = ({ section, slug }: Props) => {
  const intl = useIntl()
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const label = isCopied
    ? intl.formatMessage({
        id: 'copy_for_llm.copied',
        defaultMessage: 'Copied!',
      })
    : intl.formatMessage({
        id: 'copy_for_llm.text',
        defaultMessage: 'Copy for LLM',
      })

  const handleClick = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const locale = (router.locale as string) || 'en'
      const params = new URLSearchParams({ section, slug, locale })
      const res = await fetch(`/api/llm-content?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch content')
      const data = await res.json()
      if (data?.content) {
        const success = copy(data.content)
        if (success) {
          setIsCopied(true)
          window.setTimeout(() => setIsCopied(false), 10000)
        } else {
          throw new Error('Failed to copy to clipboard')
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('CopyForLLM error', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      as="button"
      onClick={handleClick}
      sx={isCopied ? styles.buttonCopied : styles.button}
      aria-label={label}
    >
      <CopyIcon size={14} sx={styles.icon} />
      <Text as="span" sx={styles.text}>
        {label}
      </Text>
    </Box>
  )
}

export default CopyForLLM
