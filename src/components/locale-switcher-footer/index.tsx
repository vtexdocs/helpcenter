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

export default function LocaleSwitcherFooter() {
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
    const currentPath = window.location.pathname

    setLocaleCookies(newLocale)

    const basePath = removeLocaleFromPath(currentPath)
    const pathSegments = basePath.split('/').filter(Boolean)

    let newPath: string

    if (pathSegments[0] === 'docs' && pathSegments.length >= 2) {
      const contentType = pathSegments[1]
      const currentSlug = pathSegments[2]

      if (currentSlug) {
        const localizedSlug = sidebarDataMaster
          ? findLocalizedSlug(sidebarDataMaster, currentSlug, newLocale)
          : currentSlug
        newPath = `/${newLocale}/docs/${contentType}/${encodeURIComponent(
          localizedSlug
        )}`
      } else {
        newPath = `/${newLocale}/docs/${contentType}`
      }
    } else if (
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
        newPath = `/${newLocale}/${contentType}/${encodeURIComponent(
          localizedSlug
        )}`
      } else {
        newPath = `/${newLocale}/${contentType}`
      }
    } else {
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
