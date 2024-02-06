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
  mb: '56px',
}

const optionsContainer: SxStyleProp = {
  justifyContent: ['center', 'flex-end'],
  alignItems: 'center',
  alignContent: 'center',
  gap: '24px',
  width: '100%',
  flexWrap: 'wrap',
}

const noResults: SxStyleProp = {
  py: '32px',
  textAlign: 'center',
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
  cardContainer,
  optionsContainer,
  noResults,
  searchInput,
}
