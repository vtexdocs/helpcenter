import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const row: SxStyleProp = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'stretch',
  minHeight: '48px',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  minWidth: 0,
  position: 'relative',
  zIndex: 1,
  mb: ['24px', '28px'],
}

const dateColumn: SxStyleProp = {
  width: ['64px', '72px', '88px', '104px'],
  flexShrink: 0,
  pt: '3px',
  pr: ['8px', '10px', '12px'],
  textAlign: 'right',
  fontSize: ['11px', '12px'],
  fontWeight: '600',
  lineHeight: '1.25rem',
  letterSpacing: '0.04em',
  color: tokens.grays.dateLabel,
  textTransform: 'uppercase',
  display: 'block',
  overflowWrap: 'anywhere',
}

const trackColumn: SxStyleProp = {
  width: '18px',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  pt: '3px',
}

const dot: SxStyleProp = {
  width: '12px',
  height: '12px',
  flexShrink: 0,
  borderRadius: '50%',
  borderWidth: '2px',
  borderStyle: 'solid',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 2,
}

const mainColumn: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  pl: ['12px', '16px'],
  pr: ['12px', '16px'],
  my: '-8px',
  py: '8px',
  borderRadius: '8px',
  transition: 'background-color 0.15s ease',
  ':hover': {
    backgroundColor: 'muted.4',
  },
}

const header: SxStyleProp = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
}

const caretWrap: SxStyleProp = {
  flexShrink: 0,
  pt: '4px',
  width: '20px',
  display: 'flex',
  justifyContent: 'center',
}

const caretButton: SxStyleProp = {
  ...caretWrap,
  alignItems: 'flex-start',
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

const textBlock: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-start',
}

const typeTagsContainer: SxStyleProp = {
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  mb: '4px',
}

const releaseTitle: SxStyleProp = {
  '& p': {
    mb: '8px',
    fontSize: ['16px', '18px', '20px'],
    lineHeight: ['24px', '26px', '30px'],
    color: 'muted.0',
    cursor: 'pointer',
    m: 0,
    overflowWrap: 'anywhere',
  },
}

const titleLink: SxStyleProp = {
  color: 'muted.0',
  textDecoration: 'none',
  ':hover': {
    color: 'secondary.hover',
    '& p': {
      color: 'secondary.hover',
    },
  },
}

const body: SxStyleProp = {
  mt: '12px',
  ml: ['0', '30px', '34px'],
  fontSize: ['14px', '15px'],
  lineHeight: '22px',
  fontWeight: '400',
  color: 'muted.0',
  maxWidth: '100%',
  minWidth: 0,
  overflowWrap: 'anywhere',
  letterSpacing: '-0.01em',
}

export default {
  row,
  dateColumn,
  trackColumn,
  dot,
  mainColumn,
  header,
  caretWrap,
  caretButton,
  textBlock,
  typeTagsContainer,
  releaseTitle,
  titleLink,
  body,
}
