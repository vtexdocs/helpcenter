import type { IconProps } from '@vtex/brand-ui'
import { Box, Text, Flex, Link, Icon } from '@vtex/brand-ui'

import {
  getCommunityURL,
  getDeveloperPortalURL,
  getSupportURL,
} from 'utils/get-url'

import styles from './styles'
import { useIntl } from 'react-intl'

const ArrowUpRightIcon = (props: IconProps) => (
  <Icon
    {...props}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

const EducationSection = () => {
  const intl = useIntl()

  const educationChannels = [
    {
      title: intl.formatMessage({
        id: 'landing_page_education_community.title',
      }),
      link: getCommunityURL(),
    },
    {
      title: intl.formatMessage({
        id: 'landing_page_education_support.title',
      }),
      link: getSupportURL(),
    },
    {
      title: intl.formatMessage({
        id: 'landing_page_education_developer_portal.textLink',
      }),
      link: getDeveloperPortalURL(),
    },
  ]

  return (
    <Box sx={styles.container}>
      <Text as="h2" sx={styles.title}>
        {intl.formatMessage({ id: 'landing_page_education.title' })}
      </Text>
      <Flex sx={styles.channelsContainer}>
        {educationChannels.map((channel) => (
          <Link
            key={channel.title}
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={styles.button}
          >
            {channel.title}
            <ArrowUpRightIcon sx={styles.buttonIcon} />
          </Link>
        ))}
      </Flex>
    </Box>
  )
}

export default EducationSection
