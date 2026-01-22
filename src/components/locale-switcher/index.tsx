import { useRouter } from 'next/router'
import { Box, IconGlobe, Text, IconCaret, Flex } from '@vtex/brand-ui'
import styles from './styles'
import { Disclosure, DisclosureContent, useDisclosureState } from 'reakit'
import { LocaleOption } from '@vtex/brand-ui/dist/components/Header/LocaleSwitcher'
import navigationData from '../../../public/navigation.json'

interface OptionProps {
  screen: 'mobile' | 'large'
  option: LocaleOption
  active: boolean
  onClick?: () => void
}

interface Slug {
  en?: string
  pt?: string
  es?: string
  [key: string]: string | undefined
}

interface NavigationData {
  navbar: {
    categories: {
      slug: string | Slug
      children: {
        slug: string | Slug
        children: {
          slug: string | Slug
        }[]
      }[]
    }[]
  }[]
}

const ALLOWED_LOCALES = ['en', 'es', 'pt'] as const

/**
 * Safely decode a URI component, handling malformed encodings
 * Falls back to the original string if decoding fails
 */
const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str)
  } catch {
    // If standard decoding fails, try to handle Latin-1 encoded characters
    try {
      // Replace Latin-1 encoded characters with UTF-8 equivalents
      return decodeURIComponent(
        str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
          const charCode = parseInt(hex, 16)
          // If it's a Latin-1 extended character (128-255), encode it properly as UTF-8
          if (charCode >= 128 && charCode <= 255) {
            return encodeURIComponent(String.fromCharCode(charCode))
          }
          return `%${hex}`
        })
      )
    } catch {
      // If all decoding fails, return the original string
      return str
    }
  }
}

/**
 * Set locale cookies for both Next.js (NEXT_LOCALE) and Netlify (nf_lang)
 * This ensures locale preference persists across navigation
 */
const setLocaleCookies = (locale: string) => {
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`
  document.cookie = `nf_lang=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Extract the current locale from the pathname
 * Returns the locale if found in the first path segment, otherwise null
 */
const extractLocaleFromPath = (pathname: string): string | null => {
  const segments = pathname.split('/').filter(Boolean)
  if (
    segments.length > 0 &&
    ALLOWED_LOCALES.includes(segments[0] as (typeof ALLOWED_LOCALES)[number])
  ) {
    return segments[0]
  }
  return null
}

/**
 * Remove locale prefix from pathname if present
 */
const removeLocaleFromPath = (pathname: string): string => {
  const currentLocale = extractLocaleFromPath(pathname)
  if (currentLocale) {
    return pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/'
  }
  return pathname
}

const findLocalizedSlug = async (
  slug: string,
  locale: keyof Slug
): Promise<string> => {
  if (!slug) return slug

  const decodedSlug = safeDecodeURIComponent(slug)
  const data: NavigationData = navigationData

  for (const item of data.navbar) {
    for (const category of item.categories) {
      for (const child of category.children) {
        for (const grandchild of child.children) {
          if (typeof grandchild.slug === 'object') {
            const matchingSlug = Object.values(grandchild.slug).find(
              (s) => s === decodedSlug
            )
            if (matchingSlug) {
              return grandchild.slug[locale] || slug
            }
          } else if (grandchild.slug === decodedSlug) {
            return (grandchild.slug as unknown as Slug)[locale] || slug
          }
        }

        if (typeof child.slug === 'object') {
          const matchingSlug = Object.values(child.slug).find(
            (s) => s === decodedSlug
          )
          if (matchingSlug) {
            return child.slug[locale] || slug
          }
        } else if (child.slug === decodedSlug) {
          return (child.slug as unknown as Slug)[locale] || slug
        }
      }
    }
  }

  return slug
}

export default function LocaleSwitcher() {
  const router = useRouter()
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

  const handleOptionClick = async (option: string) => {
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
        const localizedSlug = await findLocalizedSlug(currentSlug, newLocale)
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
        const localizedSlug = await findLocalizedSlug(currentSlug, newLocale)
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

    // Use window.location for full page reload to ensure proper locale handling
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
