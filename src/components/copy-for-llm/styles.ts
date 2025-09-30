import { SxStyleProp } from '@vtex/brand-ui'

const baseText: SxStyleProp = {
  color: '#A1AAB7',
  fontSize: ['14px', '16px'],
  lineHeight: '22px',
}

const button: SxStyleProp = {
  ...baseText,
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  padding: 0,
  marginLeft: '12px',
  display: 'inline-flex',
  gap: '6px',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': { color: '#6F7785' },
}

const buttonCopied: SxStyleProp = {
  ...button,
  color: '#3F3F3F',
}

const text: SxStyleProp = { ...baseText }

const icon: SxStyleProp = { color: 'currentColor' }

export default { button, buttonCopied, text, icon }
