import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  width: '100%',
  borderBottom: '1px solid #E7E9EE',
  pb: ['32px', '50px'],
  pt: ['0px', '36px', '50px'],
}

const imageContainer: SxStyleProp = {
  position: 'relative',
  maxWidth: '100%',
  height: ['142px', '203px', '268px', '352px', '367px'],
  padding: '100px',
}

const newsletterBox: SxStyleProp = {
  flexDirection: 'column',
  px: ['16px', '32px', '0px'],
  width: '100%',
  alignItems: 'center',
  textAlign: 'center',
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
}

export default {
  section,
  imageContainer,
  newsletterBox,
  newsletterTitle,
  newsletterDescription,
}
