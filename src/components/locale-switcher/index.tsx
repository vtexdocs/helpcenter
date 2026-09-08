import { useRouter } from 'next/router'
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Box, Flex, IconGlobe, Text, IconCaret } from '@vtex/brand-ui'
import { LibraryContext } from '@vtexdocs/components'
import { trackLocaleSwitch } from 'utils/analytics'
import { findLocalizedSlug } from 'utils/find-localized-slug'
import { setLocaleCookies, removeLocaleFromPath } from 'utils/locale-utils'
import styles from './styles'
import { LocaleOption } from '@vtex/brand-ui/dist/components/Header/LocaleSwitcher'

interface OptionProps {
  option: LocaleOption
  active: boolean
  onClick?: () => void
}

const supportsHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function LocaleSwitcher() {
  const router = useRouter()
  const { sidebarDataMaster } = useContext(LibraryContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!showDropdown) return

    const onPointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [showDropdown])

  const Option = ({ option, onClick, active }: OptionProps) => {
    return (
      <Box
        sx={active ? styles.optionActive : styles.option}
        role="option"
        aria-selected={active}
        onClick={onClick}
      >
        {option.label}
      </Box>
    )
  }

  const handleMouseOver = () => {
    if (supportsHover()) setShowDropdown(true)
  }

  const handleMouseLeave = () => {
    if (supportsHover()) setShowDropdown(false)
  }

  const handleClick = () => {
    if (supportsHover()) return
    setShowDropdown((visible) => !visible)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowDropdown(false)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setShowDropdown((visible) => !visible)
    }
  }

  return (
    <Flex
      ref={containerRef}
      sx={styles.localeSwitcher}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <Flex
        as="button"
        type="button"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        sx={styles.dropdownButton(showDropdown)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <IconGlobe sx={styles.iconGlobe} size={24} />
        <Text sx={styles.localeLabel}>{router.locale?.toUpperCase()}</Text>
        <IconCaret
          sx={styles.localeCaret}
          direction={showDropdown ? 'up' : 'down'}
          size={16}
        />
      </Flex>
      {showDropdown && (
        <Box sx={styles.outerContainer} role="listbox">
          <Box sx={styles.innerContainer}>
            {options.map((option) => (
              <Option
                key={option.label}
                option={option}
                onClick={() => {
                  setShowDropdown(false)
                  handleOptionClick(option.value)
                }}
                active={option.value === router.locale}
              />
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  )
}
