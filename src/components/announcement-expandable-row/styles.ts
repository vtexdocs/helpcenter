import { SxStyleProp } from '@vtex/brand-ui'

const row: SxStyleProp = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'stretch',
  minHeight: '48px',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
}

const trackColumn: SxStyleProp = {
  width: '24px',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'center',
}

const stemTop: SxStyleProp = {
  width: '2px',
  flexShrink: 0,
  flexGrow: 0,
  height: '12px',
  backgroundColor: '#E0E0E0',
}

const stemBottom: SxStyleProp = {
  width: '2px',
  flexGrow: 1,
  flexShrink: 0,
  minHeight: '16px',
  backgroundColor: '#E0E0E0',
}

const dot: SxStyleProp = {
  width: '14px',
  height: '14px',
  flexShrink: 0,
  borderRadius: '50%',
  borderWidth: '2px',
  borderStyle: 'solid',
  backgroundColor: 'transparent',
  zIndex: 1,
}

const mainColumn: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  pl: ['10px', '14px'],
  pr: '4px',
  pb: ['20px', '24px'],
}

const headerInteractive: SxStyleProp = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
  textAlign: 'left',
  font: 'inherit',
  outline: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  ':focus-visible': {
    boxShadow: '0 0 0 2px rgba(20, 32, 50, 0.2)',
    borderRadius: '4px',
  },
}

const headerStatic: SxStyleProp = {
  ...headerInteractive,
  cursor: 'default',
}

const caretWrap: SxStyleProp = {
  flexShrink: 0,
  pt: '4px',
  width: '20px',
  display: 'flex',
  justifyContent: 'center',
}

const textBlock: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: '6px',
  alignItems: 'flex-start',
}

const statusLabel: SxStyleProp = {
  fontSize: '13px',
  lineHeight: '18px',
  fontWeight: '500',
  letterSpacing: '-0.01em',
}

const title: SxStyleProp = {
  fontSize: ['15px', '16px', '17px'],
  lineHeight: ['22px', '24px'],
  fontWeight: '700',
  color: '#333333',
  textAlign: 'left',
  letterSpacing: '-0.02em',
}

const titleLink: SxStyleProp = {
  color: '#333333',
  textDecoration: 'none',
  ':hover': {
    color: '#1a1a1a',
  },
}

const timeLabel: SxStyleProp = {
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '400',
  color: '#9B9B9B',
  letterSpacing: '-0.01em',
}

const body: SxStyleProp = {
  mt: '12px',
  ml: ['30px', '34px'],
  fontSize: ['14px', '15px'],
  lineHeight: '22px',
  fontWeight: '400',
  color: '#6B6B6B',
  maxWidth: '100%',
  letterSpacing: '-0.01em',
}

export default {
  row,
  trackColumn,
  stemTop,
  stemBottom,
  dot,
  mainColumn,
  headerInteractive,
  headerStatic,
  caretWrap,
  textBlock,
  statusLabel,
  title,
  titleLink,
  timeLabel,
  body,
}
