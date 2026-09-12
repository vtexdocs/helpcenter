import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const row: SxStyleProp = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'stretch',
  minHeight: '32px',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  minWidth: 0,
  position: 'relative',
  zIndex: 1,
}

const dateColumn: SxStyleProp = {
  width: tokens.timeline.dateColumnWidth,
  flexShrink: 0,
  pt: '6px',
  pr: tokens.timeline.dateColumnPaddingRight,
  textAlign: 'right',
  fontSize: '13px',
  fontWeight: '400',
  lineHeight: '18px',
  letterSpacing: '0.02em',
  color: tokens.grays.dateLabel,
  display: 'block',
  whiteSpace: 'nowrap',
}

const trackColumn: SxStyleProp = {
  width: tokens.timeline.trackWidth,
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  pt: '8px',
}

const dot: SxStyleProp = {
  width: '10px',
  height: '10px',
  flexShrink: 0,
  borderRadius: '50%',
  borderWidth: '2px',
  borderStyle: 'solid',
  boxSizing: 'border-box',
  boxShadow: '0 0 0 3px #FFFFFF',
  position: 'relative',
  zIndex: 2,
}

const cardLink: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  ml: ['8px', '12px'],
  px: ['12px', '14px'],
  py: '8px',
  color: 'inherit',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(20, 32, 50, 0.2)',
  },
}

const releaseTitle: SxStyleProp = {
  m: 0,
  fontSize: ['15px', '16px'],
  lineHeight: ['22px', '24px'],
  fontWeight: '600',
  color: tokens.landing.body,
  overflowWrap: 'anywhere',
  transition: 'color 0.15s ease',
  'a:hover &': {
    color: tokens.landing.ink,
  },
}

const body: SxStyleProp = {
  mt: '6px',
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: '400',
  color: tokens.landing.muted,
  maxWidth: '100%',
  minWidth: 0,
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  transition: 'color 0.15s ease',
  'a:hover &': {
    color: tokens.landing.body,
  },
}

const labels: SxStyleProp = {
  mt: '10px',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
}

export default {
  row,
  dateColumn,
  trackColumn,
  dot,
  cardLink,
  releaseTitle,
  body,
  labels,
}
