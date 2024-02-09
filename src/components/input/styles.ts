import { SxStyleProp } from '@vtex/brand-ui'

const input: SxStyleProp = {
  background: 'none',
  border: '#F4F4F4',
  color: '#545454',
  fontSize: ['14px'],
  width: '100%',
  transition: 'flex 0.3s',
  outline: 'none',
}

const icon: SxStyleProp = {
  minWidth: '16px',
  minHeight: '16px',
  width: '16px',
  mr: '8px',
  flex: 0,
  maxWidth: 'fit-content',
}

const container: SxStyleProp = {
  paddingLeft: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F4F4F4',
  width: '100%',
  height: '40px',
  borderRadius: '4px',
  transition: 'all 0.3s ease-out',
  cursor: 'pointer',
  border: '1px solid #F4F4F4',

  ':hover': {
    transition: 'all 0.3s ease-out',
    border: '1px solid #3B3B3B',
  },
}

export default { container, input, icon }
