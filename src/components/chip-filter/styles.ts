import { SxStyleProp } from '@vtex/brand-ui'

const chipButtonWrapper: SxStyleProp = {
  display: 'flex',
  userSelect: 'none',
  maxWidth: '800px',
  width: '70dvw',
  minWidth: '350px',
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
  textWrap: 'nowrap',
  padding: '4px 8px',
  borderRadius: '16px',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'all .3s ease-out',
}

const activeChip: SxStyleProp = {
  ...chip,
  backgroundColor: '#E7E9EE',
  border: '2px solid #E7E9EE',
  color: '#4A596B',
  ':hover': {
    backgroundColor: '#CCCED8',
    border: '2px solid #CCCED8',
    textDecoration: 'none',
  },
}

const inactiveChip: SxStyleProp = {
  ...chip,
  backgroundColor: 'transparent',
  border: '2px solid #5E6E84',
  color: '#5E6E84',
  ':hover': {
    border: '2px solid #A1A8B3',
    color: '#A1A8B3',
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

const rightArrowBlur: SxStyleProp = {
  maxWidth: '40px',
  minWidth: '20px',
  width: '5vw',
  background:
    'linear-gradient(to left, rgba(255,255,255,80%) 30%, rgba(255, 255, 255, 1%))',
}

const leftArrowBlur: SxStyleProp = {
  maxWidth: '40px',
  minWidth: '20px',
  width: '5vw',
  background:
    'linear-gradient(to right, rgba(255,255,255,80%) 30%, rgba(255, 255, 255, 1%))',
}

const leftArrowContainer: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  flexShrink: '0',
  left: 'clamp(20px, 2.5vw, 30px)',
  zIndex: '2000',
}

const rightArrowContainer: SxStyleProp = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row-reverse',
  flexShrink: '0',
  right: 'clamp(20px, 2.5vw, 30px)',
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
