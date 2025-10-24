import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  width: '100%',
  borderBottom: '1px solid #E7E9EE',
  pb: ['32px', '50px', '0px'],
  display: 'flex',
  flexDirection: 'column', // Column layout for overlay
  position: 'relative',
  overflow: 'hidden',
  height: ['76vh', '80vh', '40vh', '50vh', '60vh'],
  minHeight: ['600px', 'auto', 'auto', 'auto', 'auto'],
}

const imageContainer: SxStyleProp = {
  width: '100%',
  height: '100%',
  overflow: 'visible',
  pt: ['0px', '0px', '0px'],
  zIndex: '1',
}

const newsletterBox: SxStyleProp = {
  flexDirection: 'column',
  width: ['100%', '100%', '47%', '44%', '40%'],
  height: '100%',
  pl: ['0px', '0px', '32px', '48px', '108px'],
  pt: ['54px', '32px', , '0px', '0px', '0px'],
  alignItems: ['center', 'center', 'flex-start'],
  textAlign: ['center', 'center', 'left'],
  justifyContent: ['flex-start', 'flex-start', 'center'],
  position: ['relative', 'relative', 'absolute'], // Absolute positioning for overlay
  top: ['auto', 'auto', '0'],
  left: ['auto', 'auto', '0'],
  zIndex: '2',
}

const newsletterTitle: SxStyleProp = {
  mb: ['8px', '8px', '8px', '8px', '16px'],
  fontSize: ['28px', '28px', '28px', '38px', '48px'],
  lineHeight: ['32px', '32px', '32px', '42px', '54px'],
}

const newsletterDescription: SxStyleProp = {
  fontSize: ['17px', '19px', '19px', '22px', '22px'],
  color: '#4A4A4A',
  lineHeight: ['23px', '25px', '25px', '28px', '28px'],
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
  newsletterBox,
  newsletterTitle,
  newsletterDescription,
  desktopImageContainer,
  mobileImageContainer,
}
