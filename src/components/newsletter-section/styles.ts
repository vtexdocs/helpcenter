import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  width: '100%',
  borderBottom: '1px solid #E7E9EE',
  pb: ['32px', '50px', '0px'],
  pt: ['0px', '36px', '50px'],
  display: 'flex',
  flexDirection: ['column', 'column', 'row-reverse'],
  alignItems: ['center', 'center', 'stretch'],
  gap: ['16px', '24px', '0px'],
}

const imageContainer: SxStyleProp = {
  position: 'relative',
  maxWidth: '100%',
  width: ['100%', '100%', '50%'],
  height: ['auto', 'auto', 'clamp(280px, 55vh, 760px)'], // scales with zoom/viewport
  overflow: 'hidden',
  pt: ['0px', '0px', '0px'],
  pr: ['16px', '24px', '0px'],
  pb: ['16px', '24px', '0px'],
  pl: ['16px', '24px', '0px'],
}

const newsletterBox: SxStyleProp = {
  flexDirection: 'column',
  width: ['100%', '100%', '50%'],
  px: ['16px', '24px', '0px'],
  // doubled left padding: 16->32, 24->48, 48->96
  pl: ['32px', '48px', '96px'],
  // limit the content to half of its own column on desktop
  maxWidth: ['100%', '100%', '50%'],
  alignItems: ['center', 'center', 'flex-start'],
  textAlign: ['center', 'center', 'left'],
  justifyContent: ['flex-start', 'flex-start', 'center'],
}

const newsletterTitle: SxStyleProp = {
  mb: '16px',
  fontSize: ['28px', '28px', '52px', '52px'],
  lineHeight: ['34px', '34px', '62px', '62px'],
}

const newsletterDescription: SxStyleProp = {
  fontSize: ['16px', '16px', '22px', '22px'],
  lineHeight: ['22px', '22px', '32px', '32px'],
  mb: '24px',
  maxWidth: ['319px', '419px', '531px', '642px'],
  whiteSpace: 'pre-line',
}

export default {
  section,
  imageContainer,
  newsletterBox,
  newsletterTitle,
  newsletterDescription,
}
