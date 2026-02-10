import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Text, Flex, Input, Link } from '@vtex/brand-ui'
import { getMessages } from 'utils/get-messages'
import { getPrivacyNoticeURL, getNewsletterURL } from 'utils/get-url'
import { LocaleType } from 'utils/typings/unionTypes'
import styles from './styles'

const messages = getMessages()

const SubscriptionList: React.FC = () => {
  const { locale } = useRouter()
  const isLocaleType = (value?: string): value is LocaleType =>
    value === 'en' || value === 'pt' || value === 'es'
  const currentLocale: LocaleType = isLocaleType(locale) ? locale : 'en'
  const localizedMessages = messages[currentLocale] ?? messages.en
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const clearMessageAfterTimeout = () => {
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const checkEmail = async (email: string): Promise<boolean> => {
    const apiKey = process.env.NEXT_PUBLIC_NEWSLETTER_API_KEY
    if (!apiKey) {
      console.error(localizedMessages['subscription_list.api_key_error'])
      return true
    }

    const url = `https://mailcheck.p.rapidapi.com/?email=${encodeURIComponent(
      email
    )}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'mailcheck.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      })

      const data = await response.json()
      // Block if not valid, or if block/disposable is true
      return !data.block
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleSubscribe = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessageType('error')
      setMessage(localizedMessages['subscription_list.invalid_email'])
      clearMessageAfterTimeout()
      return
    }

    const isValid = await checkEmail(email)
    if (!isValid) {
      setMessageType('error')
      setMessage(localizedMessages['subscription_list.invalid_email'])
      clearMessageAfterTimeout()
      return
    }

    const baseURL =
      'https://hooks.zapier.com/hooks/catch/11585741/2pahup2/?email='

    const locale = navigator.language || 'en-US'
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleString(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const urlEnd = `&locale=${locale}&date=${encodeURIComponent(formattedDate)}`
    const emailEncoded = encodeURIComponent(email)
    const url = baseURL + emailEncoded + urlEnd

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.blob())
      .then(() => {
        setMessageType('success')
        setMessage(localizedMessages['subscription_list.success'])
        setEmail('')
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 3000)
      })
      .catch((error) => {
        console.error('Error:', error)
        setMessageType('error')
        setMessage(localizedMessages['subscription_list.error'])
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 3000)
      })
  }

  return (
    <Box sx={styles.sectionContainer}>
      <Text sx={styles.title}>
        {localizedMessages['landing_page_subscription.title']}
      </Text>
      <Flex sx={styles.cardContainer}>
        <div>
          <Text sx={styles.description}>
            {
              localizedMessages['landing_page_subscription.description'].split(
                'newsletter'
              )[0]
            }
            <a
              href={getNewsletterURL(currentLocale)}
              target="_blank"
              rel="noopener noreferrer"
            >
              newsletter
            </a>
            {
              localizedMessages['landing_page_subscription.description'].split(
                'newsletter'
              )[1]
            }
          </Text>
          <Flex sx={styles.inputContainer}>
            <Input
              label="Email"
              size="regular"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={styles.inputContainer}
            />
            <Button type="button" onClick={handleSubscribe} sx={styles.button}>
              {localizedMessages['landing_page_newsletter.Button']}
            </Button>
          </Flex>
          <Text sx={styles.privacyText}>
            {localizedMessages['subscription_list.privacy_notice']}{' '}
            <Link
              href={getPrivacyNoticeURL(currentLocale)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {localizedMessages['subscription_list.privacy_policy_link']}
            </Link>
          </Text>
          {message && (
            <Box
              sx={{
                ...styles.popupCard,
                backgroundColor:
                  messageType === 'success' ? '#dff1e0' : '#f8e3e3',
              }}
            >
              <Text>{message}</Text>
            </Box>
          )}
        </div>
      </Flex>
    </Box>
  )
}

export default SubscriptionList
