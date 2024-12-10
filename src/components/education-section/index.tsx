import { Box, Text, Flex } from '@vtex/brand-ui'

import EducationChannel from 'components/education-channel'
import HelpCenterIcon from 'components/icons/helpcenter-icon'
import CommunityIcon from 'components/icons/community-icon'

import { getCommunityURL, getSupportURL } from 'utils/get-url'

import styles from './styles'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

const EducationSection = () => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  const educationChannels = [
    {
      title: messages['landing_page_education_community.title'],
      description: messages['landing_page_education_community.description'],
      textLink: messages['landing_page_education_community.textLink'],
      link: getCommunityURL(),
      icon: CommunityIcon,
    },
    {
      title: messages['landing_page_education_support.title'],
      description: messages['landing_page_education_support.description'],
      textLink: messages['landing_page_education_support.textLink'],
      link: getSupportURL(),
      icon: HelpCenterIcon,
    },
  ]
  return (
    <Box sx={styles.container}>
      <Text sx={styles.title}>{messages['landing_page_education.title']}</Text>
      <Flex sx={styles.channelsContainer}>
        {educationChannels.map((channel) => (
          <EducationChannel
            title={channel.title}
            description={channel.description}
            textLink={channel.textLink}
            link={channel.link}
            Icon={channel.icon}
            key={channel.title}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default EducationSection
