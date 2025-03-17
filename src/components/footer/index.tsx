import { Box, Flex, Link } from '@vtex/brand-ui'
import styles from './styles'
import {
  getDeveloperPortalURL,
  getGithubURL,
  getCommunityURL,
  getFeedbackURL,
  getFacebookURL,
  getInstagramURL,
  getYoutubeURL,
  getLinkedinURL,
  getTwitterURL,
} from 'utils/get-url'
import { useIntl } from 'react-intl'
import LocaleSwitcherFooter from 'components/locale-switcher-footer'
import VtexLogoFooter from 'components/icons/vtexLogoFooter'
import InstagramIcon from 'components/icons/instagram-icon'
import YoutubeIcon from 'components/icons/youtube-icon'
import FacebookCircleIcon from 'components/icons/facebook-circle-icon'
import TwitterCircleIcon from 'components/icons/twitter-circle-icon'
import LinkedinCircleIcon from 'components/icons/linkedin-circle-icon'

const Footer = () => {
  const intl = useIntl()

  const links = [
    {
      message: intl.formatMessage({
        id: 'landing_page_footer_github.message',
      }),
      to: () => getGithubURL(),
    },
    {
      message: intl.formatMessage({
        id: 'landing_page_footer_developer_portal.message',
      }),
      to: () => getDeveloperPortalURL(),
    },
    {
      message: intl.formatMessage({
        id: 'landing_page_footer_community.message',
      }),
      to: () => getCommunityURL(),
    },
    {
      message: intl.formatMessage({
        id: 'landing_page_footer_feedback.message',
      }),
      to: () => getFeedbackURL(),
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
