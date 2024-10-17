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

const findLocalizedSlug = async (
  slug: string,
  locale: keyof Slug
): Promise<string> => {
  const data: NavigationData = navigationData

  for (const item of data.navbar) {
    for (const category of item.categories) {
      for (const child of category.children) {
        // Iterate through the children of the child categories first
        for (const grandchild of child.children) {
          if (typeof grandchild.slug === 'object') {
            // Check if the current locale slug matches
            const currentLocaleSlug = Object.values(grandchild.slug).find(
              (s) => s === slug
            )

            if (currentLocaleSlug) {
              console.log(
                `Found matching grandchild slug: ${
                  grandchild.slug[locale] || slug
                }`
              )
              return grandchild.slug[locale] || slug
            }
          } else if (grandchild.slug === slug) {
            console.log(`Found matching grandchild slug: ${grandchild.slug}`)
            return (grandchild.slug as unknown as Slug)[locale] || slug
          }
        }

        // Now check the child categories
        if (typeof child.slug === 'object') {
          // Check if the current locale slug matches
          const currentLocaleSlug = Object.values(child.slug).find(
            (s) => s === slug
          )
          if (currentLocaleSlug) {
            console.log(
              `Found matching child slug: ${child.slug[locale] || slug}`
            )
            return child.slug[locale] || slug
          }
        } else if (child.slug === slug) {
          console.log(`Found matching child slug: ${child.slug}`)
          return (child.slug as unknown as Slug)[locale] || slug
        }
      }
    }
  }

  console.log(
    `No matching slug found in navbar, returning the original slug: ${slug}`
  )

  return slug
}

export default function LocaleSwitcherFooter() {
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
    const locale = option as keyof Slug
    const currentPath = window.location.pathname
    const pathParts = currentPath.split('/')

    // Obtain the current locale
    const allowedLocales = ['en', 'es', 'pt']
    const currentLocale = allowedLocales.includes(pathParts[1])
      ? pathParts[1]
      : 'en'
    const newPathParts = pathParts.filter((part) => part !== currentLocale)

    if (currentPath.includes('/docs')) {
      const contentType = newPathParts[2]
      const currentSlug = newPathParts[3]
      const localizedSlug = await findLocalizedSlug(currentSlug, locale)
      const newPath = currentSlug
        ? `/${locale}/docs/${contentType}/${localizedSlug}`
        : `/${locale}/docs/${contentType}`
      console.log(newPath)
      window.location.href = newPath
    } else if (
      currentPath.includes('/announcements') ||
      currentPath.includes('/faq') ||
      currentPath.includes('/known-issues')
    ) {
      const contentType = newPathParts[1]
      const currentSlug = newPathParts[2]
      const localizedSlug = await findLocalizedSlug(currentSlug, locale)
      const newPath = currentSlug
        ? `/${locale}/${contentType}/${localizedSlug}`
        : `/${locale}/${contentType}`
      console.log(newPath)
      window.location.href = newPath
    } else {
      console.log(currentPath)
      const newPath = `/${locale}`
      window.location.href = newPath
    }
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

  return (
    <Box sx={styles.localeSwitcher}>
      <Disclosure {...disclosure}>
        <Flex sx={{ alignItems: 'center' }}>
          <IconGlobe sx={{ color: '#CCCED8' }} size={22} />
          <Text sx={styles.localeLabel}>{router.locale?.toUpperCase()}</Text>
        </Flex>
        <IconCaret
          sx={{ color: '#CCCED8' }}
          direction={disclosure.visible ? 'up' : 'down'}
          size={30}
        />
      </Disclosure>

      <DisclosureContent {...disclosure}>
        <Box sx={styles.optionContainer}>
          {options.map((option) => (
            <Option
              key={option.label}
              option={option}
              screen="large"
              onClick={() => {
                handleOptionClick(option.value)
              }}
              active={option.value === router.locale}
            />
          ))}
        </Box>
      </DisclosureContent>
    </Box>
  )
}
