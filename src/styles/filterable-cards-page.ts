import { SxStyleProp } from '@vtex/brand-ui'

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
  gap: '16px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  mb: ['56px', '86px'],
}

const optionsContainer: SxStyleProp = {
  justifyContent: ['center', 'space-between'],
  alignItems: 'center',
  alignContent: 'center',
  gap: '24px',
  width: '100%',
  flexWrap: 'wrap',
  minWidth: '720px',
}

const optionContainer: SxStyleProp = {
  justifyContent: ['center', 'flex-end'],
  alignItems: 'center',
  alignContent: 'center',
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

export default {
  container,
  cardContainer,
  optionContainer,
  optionsContainer,
  noResults,
  resultsNumberContainer,
}
