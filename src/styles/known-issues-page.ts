import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '16px',
  width: 'max-content',
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
}

export default {
  container,
  cardContainer,
  optionsContainer,
}
