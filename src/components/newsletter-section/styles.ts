import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const section: SxStyleProp = {
  width: '100%',
  borderBottom: `1px solid ${landing.border}`,
  pb: ['32px', '50px', '0px'],
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  height: ['76vh', '80vh', '40vh', '50vh', '60vh'],
  minHeight: ['600px', '400px', '400px', '400px', '400px'],
}

const imageContainer: SxStyleProp = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
}

const imageGradient: SxStyleProp = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background: [
    'linear-gradient(180deg, #FFFFFF 12%, rgba(255, 255, 255, 0.88) 28%, rgba(255, 255, 255, 0.2) 58%, rgba(255, 255, 255, 0) 78%)',
    'linear-gradient(180deg, #FFFFFF 8%, rgba(255, 255, 255, 0.8) 26%, rgba(255, 255, 255, 0.15) 55%, rgba(255, 255, 255, 0) 75%)',
    'linear-gradient(90deg, #FFFFFF 12%, rgba(255, 255, 255, 0.96) 32%, rgba(255, 255, 255, 0.55) 48%, rgba(255, 255, 255, 0) 72%)',
  ],
}

const newsletterBox: SxStyleProp = {
  flexDirection: 'column',
  width: ['100%', '100%', '47%', '44%', '40%'],
  height: '100%',
  pl: ['0px', '0px', '32px', '48px', '108px'],
  pt: ['54px', '32px', 0],
  alignItems: ['center', 'center', 'flex-start'],
  textAlign: ['center', 'center', 'left'],
  justifyContent: ['flex-start', 'flex-start', 'center'],
  position: ['relative', 'relative', 'absolute'],
  top: ['auto', 'auto', '0'],
  left: ['auto', 'auto', '0'],
  zIndex: 2,
}

const newsletterTitle: SxStyleProp = {
  mb: ['8px', '12px', '16px'],
  fontSize: [...landing.type.heroTitle],
  lineHeight: [...landing.type.heroTitleLine],
  fontWeight: '400',
  color: landing.ink,
  letterSpacing: '-0.02em',
}

const newsletterDescription: SxStyleProp = {
  fontSize: [...landing.type.heroBody],
  color: landing.body,
  lineHeight: [...landing.type.heroBodyLine],
  maxWidth: ['75%', '419px', '531px', '642px'],
  whiteSpace: 'pre-line',
}

const desktopImageContainer: SxStyleProp = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: ['none', 'none', 'block'],
}

const mobileImageContainer: SxStyleProp = {
  position: 'absolute',
  right: 0,
  top: 0,
  width: '100%',
  height: '100%',
  minHeight: '600px',
  display: ['block', 'block', 'none'],
}

export default {
  section,
  imageContainer,
  imageGradient,
  newsletterBox,
  newsletterTitle,
  newsletterDescription,
  desktopImageContainer,
  mobileImageContainer,
}
