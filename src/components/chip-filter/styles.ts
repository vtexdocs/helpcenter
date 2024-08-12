import { SxStyleProp } from '@vtex/brand-ui'

const chipButtonWrapper: SxStyleProp = {
  display: 'flex',
  userSelect: 'none',
}

const chipsContainer: SxStyleProp = {
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  maxWidth: '800px',
  width: '60dvw',
  minWidth: '300px',
  overflow: 'scroll',
  '& ::-webkit-scrollbar': {
    display: 'none',
  },
  display: 'flex',
}

const optionsContainer: SxStyleProp = {
  display: 'flex',
  wrap: 'no-wrap',
}

const chip: SxStyleProp = {
  backgroundColor: '#fff',
  textWrap: 'nowrap',
  border: '2px solid #5E6E84',
  padding: '8px',
  borderRadius: '16px',
  margin: '0 4px',
  '& :hover': {
    cursor: 'pointer',
  },
}

const arrowButton: SxStyleProp = {
  background: 'none',
  border: 'none',
  fontWeight: '600',
  fontSize: '18px',
  ':hover': {
    cursor: 'pointer',
  },
}

export default {
  chip,
  chipsContainer,
  optionsContainer,
  arrowButton,
  chipButtonWrapper,
}
