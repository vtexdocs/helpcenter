import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: ['12px', '16px'],
  width: '100%',
  maxWidth: ['100%', '545px', '720px', '720px'],
  px: ['16px', 0],
  boxSizing: 'border-box',
  minWidth: 0,
}

const listingCard: SxStyleProp = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  a: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  },
  '& a > *': {
    width: '100% !important',
    maxWidth: '100% !important',
    minWidth: 0,
    boxSizing: 'border-box',
  },
}

const cardContainer: SxStyleProp = {
  gap: '12px',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  mb: ['56px', '86px'],
  width: '100%',
  minWidth: 0,
}

const optionsContainer: SxStyleProp = {
  justifyContent: ['flex-start', 'space-between'],
  alignItems: 'center',
  gap: ['12px', '16px', '24px'],
  width: '100%',
  minWidth: 0,
  flexWrap: 'wrap',
}

const filterWrap: SxStyleProp = {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
}

const listingFilterButton: SxStyleProp = {
  height: '32px',
  borderRadius: '16px',
  px: '12px',
}

const sortWrap: SxStyleProp = {
  minWidth: 0,
  flexShrink: 0,
  ml: ['0', 'auto'],
  maxWidth: '100%',
}

const optionContainer: SxStyleProp = {
  justifyContent: ['center', 'flex-end'],
  alignItems: 'center',
  alignContent: 'center',
  width: '100%',
  flexWrap: 'wrap',
}

const searchRow: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px 12px',
}

const searchToolbar: SxStyleProp = {
  flex: 1,
  minWidth: ['100%', 0],
  width: ['100%', 'auto'],
  alignItems: 'center',
  gap: '8px',
}

const searchInputWrap: SxStyleProp = {
  flex: '1 1 240px',
  minWidth: 0,
}

const helpButton: SxStyleProp = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '1px solid',
  borderColor: landing.border,
  backgroundColor: 'transparent',
  color: landing.body,
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'help',
  flexShrink: 0,
  p: 0,
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
  svg: {
    width: '16px',
    height: '16px',
    minWidth: '16px',
    minHeight: '16px',
    color: landing.body,
  },
}

const noResults: SxStyleProp = {
  py: '32px',
  textAlign: 'center',
  width: '100%',
  color: landing.muted,
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
}

const resultsRow: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const resultsNumberContainer: SxStyleProp = {
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  color: landing.muted,
  width: '100%',
  overflowWrap: 'anywhere',
}

const resultsNumber: SxStyleProp = {
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  color: landing.muted,
  minWidth: 0,
  overflowWrap: 'anywhere',
}

export default {
  container,
  listingCard,
  cardContainer,
  optionContainer,
  optionsContainer,
  filterWrap,
  listingFilterButton,
  sortWrap,
  searchRow,
  searchToolbar,
  searchInputWrap,
  helpButton,
  chipFilterContainer,
  chipFilterList,
  noResults,
  resultsRow,
  resultsNumberContainer,
  resultsNumber,
}
