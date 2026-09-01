import { SxStyleProp } from '@vtex/brand-ui'

const localeLabel: SxStyleProp = {
  display: 'none',
  alignItems: 'center',
  height: '24px',
  fontSize: '13px',
  lineHeight: '24px',
  fontFamily: 'VTEX Trust Medium !important',
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

const optionContainer: SxStyleProp = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '120px',
  top: '100%',
  right: 0,
  py: '8px',
  backgroundColor: '#ffffff',
  border: '1px solid #E7E9EE',
  borderRadius: '8px',
  boxShadow: '0px 4px 16px rgba(20, 32, 50, 0.12)',
  zIndex: 10,
}

const option: SxStyleProp = {
  cursor: 'pointer',
  px: '16px',
  py: '8px',
  color: '#4A596B',
  fontSize: '14px',
  lineHeight: '20px',
  ':hover': {
    color: '#C81E51',
    backgroundColor: '#FFF3F6',
  },
}

const optionActive: SxStyleProp = {
  ...option,
  color: '#E31C58',
  fontWeight: 500,
}

const localeSwitcher: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    lineHeight: 0,
    cursor: 'pointer',
    color: '#4A596B',
    bg: 'transparent',
    border: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
    borderRadius: ['0', '0', '6px', '6px'],
    transition: 'background-color 0.15s ease, color 0.15s ease',
    ':hover': {
      color: '#C81E51',
      backgroundColor: ['transparent', 'transparent', '#FFF3F6', '#FFF3F6'],
    },
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

const iconGlobeVisible: SxStyleProp = {
  ...iconGlobe,
  color: '#E31C58',
}

export default {
  iconGlobeVisible,
  localeLabel,
  localeCaret,
  optionContainer,
  option,
  optionActive,
  localeSwitcher,
  iconGlobe,
}
