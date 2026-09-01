import { SxStyleProp } from '@vtex/brand-ui'

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

const cardContainer: SxStyleProp = {
  gap: '16px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
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
}

const sortWrap: SxStyleProp = {
  minWidth: 0,
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
  gap: '8px',
}

const searchInputWrap: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  flex: 1,
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
  color: 'muted.0',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'help',
  flexShrink: 0,
  p: 0,
}

const chipFilterContainer: SxStyleProp = {
  width: '100%',
  minWidth: 0,
}

const noResults: SxStyleProp = {
  py: '32px',
  textAlign: 'center',
  width: '100%',
}

const resultsNumberContainer: SxStyleProp = {
  fontSize: '1rem',
  color: 'muted.0',
  width: '100%',
}

export default {
  container,
  cardContainer,
  optionContainer,
  optionsContainer,
  filterWrap,
  sortWrap,
  searchRow,
  searchInputWrap,
  helpButton,
  chipFilterContainer,
  noResults,
  resultsNumberContainer,
}
