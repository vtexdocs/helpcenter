import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '16px',
  width: ['320px', '545px', '545px', '720px'],
  maxWidth: '100vw',
}

const cardContainer: SxStyleProp = {
  gap: 0,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  mb: '56px',
  width: '100%',
}

const yearTimelineBody: SxStyleProp = {
  position: 'relative',
  width: '100%',
  flexDirection: 'column',
}

const yearVerticalRail: SxStyleProp = {
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  width: '2px',
  backgroundColor: tokens.grays.timelineRail,
  /** dateColumn width + trackColumn/2 − half line */
  left: ['80px', '96px', '112px'],
  top: 0,
  bottom: 0,
}

const optionsContainer: SxStyleProp = {
  justifyContent: ['center', 'flex-start'],
  alignItems: 'center',
  alignContent: 'center',
  gap: '24px',
  width: '100%',
  flexWrap: 'wrap',
}

const noResults: SxStyleProp = {
  py: '32px',
  textAlign: 'center',
}

const resultsNumberContainer: SxStyleProp = {
  fontSize: '1rem',
  color: 'muted.0',
}

const yearBlock: SxStyleProp = {
  width: '100%',
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
  display: 'inline-block',
  position: 'relative',
  left: ['81px', '97px', '113px'],
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
  optionsContainer,
  noResults,
  resultsNumberContainer,
  searchInput,
  yearBlock,
  yearHeading,
  seeMoreButton,
}
