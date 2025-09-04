import { SxStyleProp } from '@vtex/brand-ui'

const sectionContainer: SxStyleProp = {
  paddingTop: ['0px', '32px'],
  paddingBottom: ['24px', '52px', '52px', '48px'],
  margin: 'auto',
}

const title: SxStyleProp = {
  fontSize: ['28px', '28px', '28px', '40px'],
  lineHeight: ['30px', '38px', '38px', '50px'],
  fontWeight: '400',
  color: '#4A4A4A',
  textAlign: 'center',
  mt: ['32px'],
  mb: ['24px', '52px', '52px', '48px', '32px'],
}

const cardsContainer: SxStyleProp = {
  width: ['80%', '60%', '70%', '60%', '35rem', '35rem'],
  margin: 'auto',
  flexWrap: 'wrap',
  gap: ['12px', '32px'],
  alignItems: 'stretch',
}

export default {
  cardsContainer,
  sectionContainer,
  title,
}
