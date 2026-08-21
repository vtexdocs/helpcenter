import { SxStyleProp } from '@vtex/brand-ui'

const DESKTOP_FROM = '1024px'

const localeLabel: SxStyleProp = {
  color: 'white',
  pl: 2,
  display: 'block',
}

const optionContainer: SxStyleProp = {
  color: 'black',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: 'auto',
  left: 0,
  right: 'auto',
  bottom: '100%',
  px: 5,
  borderTop: 'none',
  backgroundColor: '#ffffff',
  boxShadow: '0px 20px 25px rgba(20, 32, 50, 0.1)',
  zIndex: 5,
  [`@media screen and (min-width: ${DESKTOP_FROM})`]: {
    left: 'auto',
    right: 0,
  },
}

const baseLocaleSwitcher: SxStyleProp = {
  alignItems: 'center',
  cursor: 'pointer',
  bg: 'transparent',
  border: 'none',
  outline: 'none',
}

const localeSwitcher: SxStyleProp = {
  position: 'relative',
  button: {
    ...baseLocaleSwitcher,
    display: 'flex',
    ':hover': {
      color: '#142032',
    },
    height: '100%',
    justifyContent: 'flex-start',
  },
}

export default {
  localeLabel,
  optionContainer,
  localeSwitcher,
  baseLocaleSwitcher,
}
