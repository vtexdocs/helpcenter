import {
  Header as HeaderBrand,
  Link as VtexLink,
  Flex,
  Text,
  Box,
} from '@vtex/brand-ui'
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const SearchInput = dynamic(
  () => import('@vtexdocs/components').then((mod) => mod.SearchInput),
  { ssr: false }
) as React.FC<Record<string, never>>

const HamburgerMenu = dynamic(
  () => import('@vtexdocs/components').then((mod) => mod.HamburgerMenu),
  { ssr: false }
) as React.FC<{ parentsArray?: string[] }>

import DropdownMenu from 'components/dropdown-menu'
import AnnouncementsDropdown from 'components/announcements-dropdown'
import {
  VTEXHelpCenterIcon,
  GridIcon,
  LongArrowIcon,
  MegaphoneIcon,
} from '@vtexdocs/components'
import { getFeedbackURL } from 'utils/get-url'

import AnnouncementBar from 'components/announcement-bar'
import LocaleSwitcher from 'components/locale-switcher'

import styles from './styles'
import { PreviewContext } from 'utils/contexts/preview'
import { FormattedMessage } from 'react-intl'
import { useAnnouncements } from 'utils/hooks/useAnnouncements'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Header = () => {
  const router = useRouter()
  const isBranchPreview = router.isPreview

  const { branchPreview } = useContext(PreviewContext)
  const { announcements } = useAnnouncements()

  const modalOpen = useRef(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAnnouncementsDropdown, setShowAnnouncementsDropdown] =
    useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const headerElement = useRef<HTMLElement>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [router.asPath])

  useEffect(() => {
    const body = document.body

    const observer = new MutationObserver(() => {
      modalOpen.current = !modalOpen.current
      if (headerElement.current) {
        if (modalOpen.current) {
          const headerHeight = headerElement.current.children[0].clientHeight
          headerElement.current.style.top = `-${headerHeight}px`
        } else {
          headerElement.current.style.top = '0'
        }
      }
    })
    observer.observe(body, {
      attributeFilter: ['style'],
    })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setShowDropdown(false)
      setShowAnnouncementsDropdown(false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hideDropdown = () => {
      setShowDropdown(false)
      setShowAnnouncementsDropdown(false)
    }

    router.events.on('routeChangeStart', hideDropdown)
    return () => router.events.off('routeChangeStart', hideDropdown)
  }, [])

  return (
    <Box ref={headerElement} sx={styles.headerContainer}>
      {isBranchPreview && (
        <AnnouncementBar
          closable={false}
          type="warning"
          label={`🚧 You are currently using branch ${branchPreview} in preview mode. This content may differ from the published version.`}
          action={{
            button: 'EXIT PREVIEW MODE',
            href: '/api/disable-preview',
          }}
        ></AnnouncementBar>
      )}
      <HeaderBrand sx={styles.headerBrand}>
        <VtexLink
          aria-label="Go back to Home"
          href="/"
          sx={styles.headerBrandLink}
        >
          <VTEXHelpCenterIcon sx={styles.logoSize} />
        </VtexLink>

        <Box sx={styles.searchContainer}>
          <SearchInput />
        </Box>

        <HeaderBrand.RightLinks sx={styles.rightLinks}>
          <Flex
            sx={styles.dropdownContainer}
            onMouseOver={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <Flex sx={styles.dropdownButton(showDropdown)}>
              <GridIcon />
              <Text sx={styles.rightButtonsText} data-cy="docs-dropdown">
                {' '}
                {/*TODO: mudar data-cy no teste */}
                <FormattedMessage id="landing_page_header_docs.message" />
              </Text>
            </Flex>

            {showDropdown && <DropdownMenu />}
          </Flex>

          <Flex
            sx={{
              ...styles.dropdownContainer,
              marginLeft: '32px',
            }}
            onMouseOver={() => setShowAnnouncementsDropdown(true)}
            onMouseLeave={() => setShowAnnouncementsDropdown(false)}
          >
            <Flex sx={styles.dropdownButton(showAnnouncementsDropdown)}>
              <MegaphoneIcon />
              <Text
                sx={styles.rightButtonsText}
                data-cy="announcements-dropdown"
              >
                <FormattedMessage id="landing_page_header_announcements.message" />
              </Text>
            </Flex>

            {showAnnouncementsDropdown && announcements.length > 0 && (
              <AnnouncementsDropdown
                announcements={announcements
                  .slice(0, 2)
                  .map((announcement) => ({
                    title: announcement.title,
                    date: new Date(announcement.createdAt),
                    url: `/${announcement.url}`,
                    tags: announcement.tags || [],
                  }))}
              />
            )}
          </Flex>

          <VtexLink
            sx={styles.rightLinksItem}
            href={getFeedbackURL(currentUrl)}
            target="_blank"
          >
            <LongArrowIcon />
            <Text sx={styles.rightButtonsText}>
              <FormattedMessage id="landing_page_header_feedback.message" />
            </Text>
          </VtexLink>
          <Flex sx={styles.containerHamburguerLocale}>
            <HamburgerMenu />
            <Box sx={styles.splitter}></Box>
            <Box sx={styles.localeSwitcherContainer}>
              <LocaleSwitcher />
            </Box>
          </Flex>
        </HeaderBrand.RightLinks>
      </HeaderBrand>
    </Box>
  )
}

export default Header
