import type { SxStyleProp } from '@vtex/brand-ui'

const copyIcon: SxStyleProp = {
  marginRight: '4px',
}

const copyLinkButton: SxStyleProp = {
  textTransform: 'none',
  color: '#3F3F3F',
  fontWeight: '100',
  fontSize: '12px',
  lineHeight: '18px',
  height: 'none',
  padding: '8px 8px 8px 8px',
  border: '1px solid #A1AAB7',
  backgroundColor: 'white',
  ':hover': {
    backgroundColor: '#EFEFEF',
  },
}

export default {
  copyIcon,
  copyLinkButton,
}
