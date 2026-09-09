import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: ['100%', '545px', '545px', '720px'],
  px: ['16px', 0],
  boxSizing: 'border-box',
  minWidth: 0,
}

const cardContainer: SxStyleProp = {
  gap: 0,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  mb: '56px',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
}

const yearTimelineBody: SxStyleProp = {
  position: 'relative',
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
}

const yearVerticalRail: SxStyleProp = {
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  width: '2px',
  backgroundColor: tokens.grays.timelineRail,
  /** dateColumn width + trackColumn/2 − half line */
  left: ['72px', '80px', '96px', '112px'],
  top: 0,
  bottom: 0,
}

const toolbar: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flexDirection: ['column', 'row'],
  alignItems: ['stretch', 'center'],
  gap: ['12px', '12px'],
  flexWrap: 'wrap',
}

const filterWrap: SxStyleProp = {
  flexShrink: 0,
}

const searchWrap: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  width: ['100%', 'auto'],
  alignItems: 'center',
  gap: '8px',
}

const helpButton: SxStyleProp = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '1px solid',
  borderColor: 'muted.2',
  backgroundColor: 'transparent',
  color: 'muted.1',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'help',
  flexShrink: 0,
  p: 0,
  transition: '0.2s',
  ':hover': {
    borderColor: 'muted.0',
    color: 'muted.0',
  },
  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(20, 32, 50, 0.2)',
  },
}

const noResults: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  py: ['40px', '56px'],
  px: '24px',
  mt: '8px',
  textAlign: 'center',
  fontSize: '15px',
  color: 'muted.1',
  backgroundColor: 'muted.4',
  borderRadius: '8px',
}

const resultsNumberContainer: SxStyleProp = {
  fontSize: '14px',
  fontWeight: '600',
  color: 'muted.1',
  mb: ['24px', '32px'],
}

const yearBlock: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 0,
}

const yearHeading: SxStyleProp = {
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  fontSize: ['18px', '19px', '20px'],
  lineHeight: '1.2',
  fontWeight: '400',
  color: tokens.grays.yearHeading,
  width: 'auto',
  maxWidth: '100%',
  display: 'inline-block',
  position: 'relative',
  left: ['73px', '81px', '97px', '113px'],
  transform: 'translateX(-50%)',
  textAlign: 'center',
  mb: ['20px', '24px'],
  letterSpacing: '-0.01em',
}

const seeMoreButton: SxStyleProp = {
  alignSelf: 'center',
  mt: ['32px', '40px'],
  px: '24px',
  py: '10px',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  fontSize: ['14px', '15px'],
  fontWeight: '600',
  color: 'muted.0',
  backgroundColor: 'transparent',
  border: '1px solid',
  borderColor: 'muted.2',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: '0.2s',
  ':hover': {
    borderColor: 'muted.0',
    color: 'secondary.hover',
    boxShadow: '0 1px 2px rgba(20, 32, 50, 0.08)',
  },
  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(20, 32, 50, 0.2)',
  },
}

const searchInput: SxStyleProp = {
  backgroundColor: '#F4F4F4',
  border: 'none',
  borderRadius: '4px',
  width: '100%',
  padding: '16px 24px',
  fontSize: '14px',
  lineHeight: '19px',
  transition: '0.3s',
  outline: 'none',
}

export default {
  container,
  cardContainer,
  yearTimelineBody,
  yearVerticalRail,
  toolbar,
  filterWrap,
  searchWrap,
  helpButton,
  noResults,
  resultsNumberContainer,
  searchInput,
  yearBlock,
  yearHeading,
  seeMoreButton,
}
