import { SxStyleProp } from '@vtex/brand-ui'

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
  width: '100dvw',
  wrap: 'no-wrap',
}

const chip: SxStyleProp = {
  background: 'none',
  textWrap: 'nowrap',
  border: '2px solid #5E6E84',
  padding: '8px',
  borderRadius: '16px',
  margin: '0 4px',
  width: '580px',
  ':hover': {
    cursor: 'pointer',
  },
}

export default {
  chip,
  chipsContainer,
  optionsContainer,
}
