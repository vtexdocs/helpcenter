import { SxStyleProp } from '@vtex/brand-ui'

const localeLabel: SxStyleProp = {
  pl: 2,
  display: ['none', 'none', 'none', 'block'],
}

const localeCaret: SxStyleProp = {
  display: ['none', 'none', 'none', 'block'],
}

const optionContainer: SxStyleProp = {
  position: 'absolute',
  display: ['flex'],
  flexDirection: 'column',
  width: '11rem',
  top: 0,
  right: '0',
  px: 5,
  mt: '5rem',
  border: '1px solid #e7e9ed',
  borderTop: 'none',
  backgroundColor: '#ffffff',
  boxShadow: '0px 20px 25px rgba(20, 32, 50, 0.1)',
}

const baseLocaleSwitcher: SxStyleProp = {
  alignItems: 'center',
  cursor: 'pointer',
  bg: '#ffffff',
  border: 'none',
  outline: 'none',
}
const localeSwitcher: SxStyleProp = {
  button: {
    ...baseLocaleSwitcher,
    display: ['flex'],
    ':hover': {
      color: '#142032',
    },
    height: '100%',
    justifyContent: 'flex-start',
    borderLeft: ['1px solid #e7e9ed'],
    // ml: '40px',
  },
}

const iconGlobe: SxStyleProp = {
  mb: ['0px', '0px', '0px', '3px'],
}

const iconGlobeVisible: SxStyleProp = {
  mb: ['0px', '0px', '0px', '3px'],
  color: [
    'var(--theme-ui-colors-primary-base, #E31C58)',
    'var(--theme-ui-colors-primary-base, #E31C58)',
    'var(--theme-ui-colors-primary-base, #E31C58)',
    '#4A596B',
  ],
}

export default {
  iconGlobeVisible,
  localeLabel,
  localeCaret,
  optionContainer,
  localeSwitcher,
  baseLocaleSwitcher,
  iconGlobe,
}
