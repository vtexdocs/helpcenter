import { Box, Flex, Link } from '@vtex/brand-ui'
import styles from './styles'
import {
  getDeveloperPortalURL,
  getGithubURL,
  getCommunityURL,
  getFeedbackURL,
  getSiteMapURL,
  getFacebookURL,
  getInstagramURL,
  getYoutubeURL,
  getLinkedinURL,
  getTwitterURL,
} from 'utils/get-url'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'
import LocaleSwitcherFooter from 'components/locale-switcher-footer'
import VtexLogoFooter from 'components/icons/vtexLogoFooter'
import InstagramIcon from 'components/icons/instagram-icon'
import YoutubeIcon from 'components/icons/youtube-icon'
import FacebookCircleIcon from 'components/icons/facebook-circle-icon'
import TwitterCircleIcon from 'components/icons/twitter-circle-icon'
import LinkedinCircleIcon from 'components/icons/linkedin-circle-icon'

const Footer = () => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  const links = [
    {
      message: messages['landing_page_footer_github.message'],
      to: () => getGithubURL(),
    },
    {
      message: messages['landing_page_footer_developer_portal.message'],
      to: () => getDeveloperPortalURL(),
    },
    {
      message: messages['landing_page_footer_community.message'],
      to: () => getCommunityURL(),
    },
    {
      message: messages['landing_page_footer_feedback.message'],
      to: () => getFeedbackURL(),
    },
    {
      message: messages['landing_page_footer_site_map.message'],
      to: () => getSiteMapURL(),
    },
  ]

  const socialIcons = [
    {
      to: () => getFacebookURL(),
      component: <FacebookCircleIcon sx={styles.icon} />,
    },
    {
      to: () => getInstagramURL(),
      component: <InstagramIcon sx={styles.icon} />,
    },
    {
      to: () => getYoutubeURL(),
      component: <YoutubeIcon sx={styles.icon} />,
    },
    {
      to: () => getLinkedinURL(),
      component: <LinkedinCircleIcon sx={styles.icon} />,
    },
    {
      to: () => getTwitterURL(),
      component: <TwitterCircleIcon sx={styles.icon} />,
    },
  ]
  return (
    <Box sx={styles.outerBox}>
      <VtexLogoFooter sx={{ width: '61px', height: '22px' }} />
      <Flex sx={styles.socialMediaIcons}>
        {socialIcons.map((icon, index) => (
          <Link key={index} href={icon.to()}>
            {icon.component}
          </Link>
        ))}
      </Flex>
      <Flex sx={styles.textLinkItems}>
        {links.map((link, index) => (
          <Link sx={{ color: '#CCCED8' }} key={index} href={link.to()}>
            {link.message}
          </Link>
        ))}
        <LocaleSwitcherFooter sx={styles.localeSwitchLanding} />
      </Flex>
    </Box>
  )
}

export default Footer
