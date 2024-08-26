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
  padding: '0 16px',
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
  gap: '8px',
}

const chip: SxStyleProp = {
  fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
  color: '#5E6E84',
  textWrap: 'nowrap',
  border: '2px solid #5E6E84',
  padding: '4px 8px',
  borderRadius: '16px',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'all 0.3s',
  ':hover': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    textDecoration: 'none',
  },
}

const activeChip: SxStyleProp = {
  ...chip,
  backgroundColor: '#e31c58',
  color: '#fff',
}

const inactiveChip: SxStyleProp = {
  ...chip,
  backgroundColor: 'transparent',
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

const rightArrowBlur: SxStyleProp = {
  width: '40px',
  background:
    'linear-gradient(to left, rgba(255,255,255,80%) 30%, rgba(255, 255, 255, 1%))',
}

const leftArrowBlur: SxStyleProp = {
  width: '40px',
  background:
    'linear-gradient(to right, rgba(255,255,255,80%) 30%, rgba(255, 255, 255, 1%))',
}

const leftArrowContainer: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
  left: '30px',
  zIndex: '2000',
}

const rightArrowContainer: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row-reverse',
  flexShrink: '0',
  right: '30px',
  zIndex: '2000',
}

const articlesAmount: SxStyleProp = {
  backgroundColor: '#fff',
  padding: '2px 8px',
  margin: '0 2px 0 8px',
  borderRadius: '8px',
  fontSize: '0.8rem',
}

export default {
  leftArrowBlur,
  rightArrowBlur,
  inactiveChip,
  activeChip,
  arrowButton,
  chipsContainer,
  optionsContainer,
  chipButtonWrapper,
  leftArrowContainer,
  rightArrowContainer,
  articlesAmount,
}
