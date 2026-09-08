import { Flex, Text } from '@vtex/brand-ui'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { MegaphoneIcon } from '@vtexdocs/components'
import AnnouncementsDropdown from 'components/announcements-dropdown'
import { useAnnouncements } from 'utils/hooks/useAnnouncements'
import styles from './styles'

const AnnouncementsMenu = () => {
  const router = useRouter()
  const { announcements } = useAnnouncements()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowDropdown(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hideDropdown = () => setShowDropdown(false)
    router.events.on('routeChangeStart', hideDropdown)
    return () => router.events.off('routeChangeStart', hideDropdown)
  }, [router.events])

  return (
    <Flex
      sx={styles.dropdownContainer}
      onMouseOver={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Flex sx={styles.dropdownButton(showDropdown)}>
        <MegaphoneIcon />
        <Text sx={styles.rightButtonsText} data-cy="announcements-dropdown">
          <FormattedMessage id="landing_page_header_announcements.message" />
        </Text>
      </Flex>

      {showDropdown && announcements.length > 0 && (
        <AnnouncementsDropdown
          announcements={announcements.slice(0, 2).map((announcement) => ({
            title: announcement.title,
            date: new Date(announcement.createdAt),
            url: `/${announcement.url}`,
            tags: announcement.tags || [],
          }))}
        />
      )}
    </Flex>
  )
}

export default AnnouncementsMenu
