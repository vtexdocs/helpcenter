import { SxStyleProp } from '@vtex/brand-ui'

const localeSwitcher: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 'calc(100% + 1px)',
  cursor: 'pointer',
}

const dropdownButton: (active: boolean) => SxStyleProp = (active: boolean) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  width: ['100%', '100%', 'auto', 'auto'],
  height: ['100%', '100%', '36px', '36px'],
  px: [0, 0, '10px', '10px'],
  margin: 0,
  lineHeight: 0,
  cursor: 'pointer',
  color: active ? '#D71D55' : '#4A596B',
  backgroundColor: active
    ? ['transparent', 'transparent', '#FFF3F6', '#FFF3F6']
    : 'transparent',
  border: 'none',
  outline: 'none',
  whiteSpace: 'nowrap',
  borderRadius: ['0', '0', '6px', '6px'],
  transition: 'background-color 0.15s ease, color 0.15s ease',
  svg: {
    color: 'inherit',
  },
  ':hover': {
    color: '#C81E51',
    backgroundColor: ['transparent', 'transparent', '#FFF3F6', '#FFF3F6'],
  },
})

const localeLabel: SxStyleProp = {
  display: 'none',
  alignItems: 'center',
  height: '24px',
  fontSize: '13px',
  lineHeight: '22px',
  fontFamily: 'VTEX Trust Medium !important',
  fontWeight: 'normal',
  textTransform: 'none',
  color: 'inherit',
  '@media screen and (min-width: 1024px)': {
    display: 'flex',
  },
}

const localeCaret: SxStyleProp = {
  display: 'none',
  color: 'inherit',
  flexShrink: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  maxWidth: 'none',
  '@media screen and (min-width: 1024px)': {
    display: 'block',
  },
}

const iconGlobe: SxStyleProp = {
  color: 'inherit',
  flexShrink: 0,
  display: 'block',
  width: '24px',
  height: '24px',
  minWidth: '24px',
  minHeight: '24px',
  maxWidth: 'none',
}

const outerContainer: SxStyleProp = {
  cursor: 'initial',
  top: 'calc(5rem + 1px)',
  right: 0,
  position: 'absolute',
  filter: 'drop-shadow(0px 0px 16px rgba(0, 0, 0, 0.1))',
  clipPath: 'inset(0 -32px -32px -32px)',
  borderRadius: '0px 0px 8px 8px',
  border: '1px solid #E7E9EE',
  borderTop: '0px',
  background: 'white',
  padding: '8px',
  minWidth: '100px',
  maxWidth: 'calc(100vw - 32px)',
  zIndex: 10,
}

const innerContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const option: SxStyleProp = {
  cursor: 'pointer',
  padding: '12px',
  borderRadius: '8px',
  boxSizing: 'border-box',
  color: '#142032',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 500,
  ':hover, :active': {
    color: '#C81E51',
    backgroundColor: '#FFF3F6',
  },
}

const optionActive: SxStyleProp = {
  ...option,
  color: '#D71D55',
}

export default {
  localeSwitcher,
  dropdownButton,
  localeLabel,
  localeCaret,
  iconGlobe,
  outerContainer,
  innerContainer,
  option,
  optionActive,
}
