import { SxStyleProp } from '@vtex/brand-ui'

const sectionContainer: SxStyleProp = {
  width: '100%',
  paddingTop: ['28px', '54px', '54px', '80px'],
  paddingBottom: ['24px', '52px', '52px', '48px'],
  px: ['32px', '64px', '64px', '128px', '160px', '256px'],
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

const title: SxStyleProp = {
  fontSize: ['28px', '28px', '28px', '40px'],
  lineHeight: ['30px', '38px', '38px', '50px'],
  fontWeight: '400',
  color: '#4A4A4A',
  mb: ['26px', '33px'],
}

const contentCards: SxStyleProp = {
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 50%',
  gap: '32px',
}

export default {
  sectionContainer,
  contentCards,
  title,
}
