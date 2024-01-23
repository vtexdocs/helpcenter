import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '16px',
  width: 'max-content',
}

const cardContainer: SxStyleProp = {
  gap: '16px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  mb: ['56px', '86px'],
}

const optionsContainer: SxStyleProp = {
  justifyContent: 'space-between',
  width: '100%',
  flexWrap: 'wrap',
}

export default {
  container,
  cardContainer,
  optionsContainer,
}
