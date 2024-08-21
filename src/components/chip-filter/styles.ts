import { SxStyleProp } from '@vtex/brand-ui'

const chipButtonWrapper: SxStyleProp = {
  display: 'flex',
  userSelect: 'none',
  maxWidth: '800px',
  width: '70dvw',
  minWidth: '300px',
}

const chipsContainer: SxStyleProp = {
  margin: '0 4px',
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
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
  backgroundColor: 'transparent',
  fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
  color: '#5E6E84',
  textWrap: 'nowrap',
  border: '2px solid #5E6E84',
  padding: '4px 8px',
  borderRadius: '16px',
  margin: '0 4px',
  textTransform: 'none',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: 'transparent',
    textDecoration: 'none',
  },
}

const arrowButton: SxStyleProp = {
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '50%',
  fontWeight: '600',
  fontSize: '16px',
  padding: '0 8px',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
    backgroundColor: 'transparent',
  },
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
