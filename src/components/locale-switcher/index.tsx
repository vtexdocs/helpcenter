import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Box, IconGlobe, Text, IconCaret, Flex } from '@vtex/brand-ui'
import { LibraryContext } from '@vtexdocs/components'
import { trackLocaleSwitch } from 'utils/analytics'
import { findLocalizedSlug } from 'utils/find-localized-slug'
import { setLocaleCookies, removeLocaleFromPath } from 'utils/locale-utils'
import styles from './styles'
import { Disclosure, DisclosureContent, useDisclosureState } from 'reakit'
import { LocaleOption } from '@vtex/brand-ui/dist/components/Header/LocaleSwitcher'

interface OptionProps {
  screen: 'mobile' | 'large'
  option: LocaleOption
  active: boolean
  onClick?: () => void
}

export default function LocaleSwitcher() {
  const router = useRouter()
  const { sidebarDataMaster } = useContext(LibraryContext)
  const options: LocaleOption[] = [
    {
      label: 'EN',
      value: 'en',
    },
    {
      label: 'PT',
      value: 'pt',
    },
    {
      label: 'ES',
      value: 'es',
    },
  ]

  const handleOptionClick = (option: string) => {
    const newLocale = option as 'en' | 'pt' | 'es'
    // Use pathname which is already decoded by the browser
    const currentPath = window.location.pathname

    // Set cookies for both Next.js and Netlify
    setLocaleCookies(newLocale)

    // Remove existing locale from path to get the base path
    const basePath = removeLocaleFromPath(currentPath)
    const pathSegments = basePath.split('/').filter(Boolean)

    let newPath: string

    // Handle /docs/* routes (e.g., /docs/tutorials/slug, /docs/tracks/slug)
    if (pathSegments[0] === 'docs' && pathSegments.length >= 2) {
      const contentType = pathSegments[1] // tutorials, tracks, etc.
      const currentSlug = pathSegments[2]

      if (currentSlug) {
        const localizedSlug = sidebarDataMaster
          ? findLocalizedSlug(sidebarDataMaster, currentSlug, newLocale)
          : currentSlug
        // Encode the slug to ensure proper URL encoding (UTF-8)
        newPath = `/${newLocale}/docs/${contentType}/${encodeURIComponent(
          localizedSlug
        )}`
      } else {
        newPath = `/${newLocale}/docs/${contentType}`
      }
    }
    // Handle other content types (announcements, faq, known-issues, troubleshooting)
    else if (
      ['known-issues', 'troubleshooting', 'announcements', 'faq'].includes(
        pathSegments[0]
      )
    ) {
      const contentType = pathSegments[0]
      const currentSlug = pathSegments[1]

      if (currentSlug) {
        const localizedSlug = sidebarDataMaster
          ? findLocalizedSlug(sidebarDataMaster, currentSlug, newLocale)
          : currentSlug
        // Encode the slug to ensure proper URL encoding (UTF-8)
        newPath = `/${newLocale}/${contentType}/${encodeURIComponent(
          localizedSlug
        )}`
      } else {
        newPath = `/${newLocale}/${contentType}`
      }
    }
    // Handle root and other pages
    else {
      newPath = basePath === '/' ? `/${newLocale}` : `/${newLocale}${basePath}`
    }

    trackLocaleSwitch(router.locale || 'en', newLocale)
    window.location.href = newPath
  }

  const disclosure = useDisclosureState({ visible: false })

  const Option = ({ screen, option, onClick, active }: OptionProps) => {
    const variant = `localeSwitcher.${screen}.option`

    return (
      <Box
        variant={`${variant}${active ? '.active' : ''}`}
        role="presentation"
        onClick={onClick}
      >
        {option.label}
      </Box>
    )
  }

  const renderGlobe = (isDisclosureVisible: boolean) => {
    if (isDisclosureVisible) {
      return <IconGlobe sx={styles.iconGlobeVisible} size={24} />
    }

    return <IconGlobe sx={styles.iconGlobe} size={24} />
  }

  return (
    <Box sx={styles.localeSwitcher}>
      <Disclosure {...disclosure}>
        <Flex sx={{ alignItems: 'center' }}>
          {renderGlobe(disclosure.visible)}
          <Text sx={styles.localeLabel}>{router.locale?.toUpperCase()}</Text>
        </Flex>
        <IconCaret
          sx={styles.localeCaret}
          direction={disclosure.visible ? 'up' : 'down'}
          size={30}
        />
      </Disclosure>
      <Box sx={styles.optionContainer}>
        <DisclosureContent {...disclosure}>
          {options.map((option) => (
            <Option
              key={option.label}
              option={option}
              screen="large"
              onClick={() => {
                disclosure.hide()
                handleOptionClick(option.value)
              }}
              active={option.value === router.locale}
            />
          ))}
        </DisclosureContent>
      </Box>
    </Box>
  )
}
