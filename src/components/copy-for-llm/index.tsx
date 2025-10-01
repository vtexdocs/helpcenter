import { useState, useEffect } from 'react'
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

  // Reset state when locale or slug changes
  useEffect(() => {
    setIsCopied(false)
    setIsLoading(false)
  }, [router.locale, slug])
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
    // Prevent multiple clicks, but reset state if already copied
    if (isLoading) return
    if (isCopied) {
      setIsCopied(false)
      return
    }

    setIsLoading(true)
    try {
      const locale = (router.locale as string) || 'en'
      const params = new URLSearchParams({ section, slug, locale })

      // eslint-disable-next-line no-console
      console.log('CopyForLLM: Fetching content', { section, slug, locale })

      const res = await fetch(`/api/llm-content?${params.toString()}`)
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to fetch content: ${res.status} ${errorText}`)
      }

      const data = await res.json()

      // eslint-disable-next-line no-console
      console.log('CopyForLLM: Received content', {
        locale: data.locale,
        slug: data.slug,
        contentLength: data?.content?.length,
      })

      if (data?.content) {
        const success = copy(data.content)
        if (success) {
          // eslint-disable-next-line no-console
          console.log('CopyForLLM: Successfully copied to clipboard')
          setIsCopied(true)
          window.setTimeout(() => setIsCopied(false), 10000)
        } else {
          throw new Error('Failed to copy to clipboard')
        }
      } else {
        throw new Error('No content received from API')
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('CopyForLLM error', err)
      // Reset state on error so user can try again
      setIsCopied(false)
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
