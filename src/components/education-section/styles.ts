import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  pt: ['32px', '64px'],
  pb: ['64px', '64px', '64px', '96px', '96px', '128px'],
  px: ['18px', '32px', '96px'],
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #E7E9EE',
}

const title: SxStyleProp = {
  fontSize: ['28px', '28px', '28px', '28px', '40px'],
  lineHeight: ['30px', '38px', '38px', '38px', '50px'],
  color: 'text',
  textAlign: 'center',
  mb: ['0px', '0px', '0px', '0px', '64px'],
}

const channelsContainer: SxStyleProp = {
  flexDirection: ['column', 'column', 'column', 'column', 'row'],
  justifyContent: 'center',
  alignItems: 'center',
}

export default {
  container,
  title,
  channelsContainer,
}
