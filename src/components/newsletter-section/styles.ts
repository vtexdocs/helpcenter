import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  width: '100%',
  borderBottom: '1px solid #E7E9EE',
  pb: ['32px', '50px', '0px'],
  pt: ['0px', '36px', '0px'],
  display: 'flex',
  flexDirection: ['column', 'column', 'column'], // Column layout for overlay
  alignItems: ['center', 'center', 'stretch'],
  gap: ['16px', '24px', '0px'],
  position: 'relative',
  overflow: 'hidden',
  minHeight: ['auto', 'auto', '100vh'], // Full height for image
  margin: 0,
  padding: 0,
}

const imageContainer: SxStyleProp = {
  position: ['relative', 'relative', 'absolute'],
  top: ['auto', 'auto', '0'],
  left: ['auto', 'auto', '0'],
  right: ['auto', 'auto', '0'],
  bottom: ['auto', 'auto', '0'],
  maxWidth: '100%',
  width: '100%',
  height: ['auto', 'auto', '100%'], // Full height on desktop
  overflow: 'visible', // Allow image to resize without being cut
  pt: ['0px', '0px', '0px'],
  pr: ['16px', '24px', '0px'],
  pb: ['16px', '24px', '0px'],
  pl: ['16px', '24px', '0px'],
  zIndex: ['auto', 'auto', '1'],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end', // Align image to the right
  transform: ['none', 'none', 'scale(1.0)'], // Normal size on desktop
  transformOrigin: 'right center', // Scale from the right side
  margin: 0,
  padding: 0,
}

const newsletterBox: SxStyleProp = {
  flexDirection: 'column',
  width: ['100%', '100%', '33.333%'], // 1/3 of the width on desktop
  px: ['16px', '24px', '0px'],
  // doubled left padding: 16->32, 24->48, 48->96
  pl: ['32px', '48px', '96px'],
  // 1/3 width on desktop
  maxWidth: ['100%', '100%', '33.333%'],
  alignItems: ['center', 'center', 'flex-start'],
  textAlign: ['center', 'center', 'left'],
  justifyContent: ['flex-start', 'flex-start', 'center'],
  position: ['relative', 'relative', 'absolute'], // Absolute positioning for overlay
  top: ['auto', 'auto', '0'],
  left: ['auto', 'auto', '0'],
  zIndex: ['auto', 'auto', '2'],
  backgroundColor: ['transparent', 'transparent', 'rgba(255, 255, 255, 0.9)'],
  py: ['0px', '0px', '50px'],
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
