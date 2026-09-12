import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  maxWidth: ['100%', '545px', '720px', '720px'],
  px: ['16px', 0],
  boxSizing: 'border-box',
  minWidth: 0,
}

const stickyControls: SxStyleProp = {
  position: 'sticky',
  top: '64px',
  zIndex: 3,
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: '12px',
  backgroundColor: '#FFFFFF',
  pt: '8px',
  pb: '12px',
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
  gap: 0,
}

const yearItems: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: ['16px', '18px'],
}

const yearVerticalRail: SxStyleProp = {
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  width: '2px',
  backgroundColor: tokens.grays.timelineRail,
  left: tokens.timeline.railLeft,
  top: '10px',
  bottom: '12px',
  borderRadius: '1px',
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
  display: 'flex',
  alignItems: 'center',
}

const searchWrap: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  width: '100%',
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

const chipFilterContainer: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
}

const chipFilterList: SxStyleProp = {
  flex: 1,
  minWidth: 0,
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
  fontSize: '13px',
  fontWeight: '500',
  color: 'muted.1',
  mb: ['16px', '20px'],
}

const yearBlock: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flexDirection: 'column',
  gap: 0,
}

const yearHeadingRow: SxStyleProp = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  minWidth: 0,
  mb: '12px',
}

const yearHeadingTrack: SxStyleProp = {
  width: tokens.timeline.trackWidth,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
}

const yearRailNode: SxStyleProp = {
  width: '8px',
  height: '8px',
  minWidth: '8px',
  minHeight: '8px',
  flexShrink: 0,
  borderRadius: '50%',
  backgroundColor: tokens.grays.dateLabel,
  boxShadow: '0 0 0 3px #FFFFFF',
  position: 'relative',
  zIndex: 2,
}

const yearHeading: SxStyleProp = {
  width: tokens.timeline.dateColumnWidth,
  flexShrink: 0,
  pr: tokens.timeline.dateColumnPaddingRight,
  m: 0,
  textAlign: 'right',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  fontSize: '14px',
  lineHeight: '18px',
  fontWeight: '400',
  color: tokens.landing.ink,
  whiteSpace: 'nowrap',
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
  stickyControls,
  cardContainer,
  yearTimelineBody,
  yearItems,
  yearVerticalRail,
  toolbar,
  filterWrap,
  searchWrap,
  helpButton,
  chipFilterContainer,
  chipFilterList,
  noResults,
  resultsNumberContainer,
  searchInput,
  yearBlock,
  yearHeadingRow,
  yearHeadingTrack,
  yearRailNode,
  yearHeading,
  seeMoreButton,
}
