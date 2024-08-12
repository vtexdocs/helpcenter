import { SxStyleProp } from '@vtex/brand-ui'

const chipButtonWrapper: SxStyleProp = {
  display: 'flex',
  userSelect: 'none',
  ':hover': {
    cursor: 'pointer',
    border: '1px red',
  },
}

const chipsContainer: SxStyleProp = {
  margin: '0 4px',
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  maxWidth: '800px',
  width: '50dvw',
  minWidth: '300px',
  overflow: 'scroll',
  scrollBehavior: 'smooth',
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
  fontSize: '1rem',
  color: '#5E6E84',
  textWrap: 'nowrap',
  border: '2px solid #5E6E84',
  padding: '4px 8px',
  borderRadius: '16px',
  margin: '0 4px',
  '& :hover': {
    cursor: 'pointer',
  },
}

const arrowButton: SxStyleProp = {
  backgroundColor: '#fff',
  border: 'none',
  borderRadius: '50%',
  fontWeight: '600',
  fontSize: '16px',
  padding: '0 4px',
}

const rightArrowButton: SxStyleProp = {
  ...arrowButton,
  '::before': {
    background: 'linear-gradient(to left,black 20%,rgba(255,255,255,0) 80%)',
  },
}

const leftArrowButton: SxStyleProp = {
  ...arrowButton,
  '::after': {
    background: 'linear-gradient(to right,black 20%,rgba(255,255,255,0) 80%)',
  },
}

export default {
  chip,
  chipsContainer,
  optionsContainer,
  leftArrowButton,
  rightArrowButton,
  chipButtonWrapper,
}
