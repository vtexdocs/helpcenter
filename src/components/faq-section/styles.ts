import { SxStyleProp } from '@vtex/brand-ui'

const sectionContainer: SxStyleProp = {
  px: ['8px', '12px', '96px', '38px'],
  paddingTop: ['0px', '32px'],
  paddingBottom: ['32px', '42px', '54px', '102px', '102px', '48px'],
  backgroundColor: 'muted.4',
  display: 'flex',
  alignItems: ['center', 'center', 'center', 'center', 'center', 'flex-start'],
  justifyContent: 'center',
  flexDirection: ['column', 'column', 'column', 'column', 'column', 'row'],
}

const titleContainer: SxStyleProp = {
  maxWidth: ['324px', '324px', '479px'],
  textAlign: ['center', 'center', 'center', 'center', 'center', 'start'],
}

const title: SxStyleProp = {
  fontSize: ['28px', '28px', '40px', '40px', '40px'],
  mb: '8px',
  color: '#4A4A4A',
  mt: ['32px'],
}

const description: SxStyleProp = {
  fontSize: ['16px', '16px', '24px', '24px', '24px'],
  fontWeight: '400',
  color: '#4A4A4A',
}

const cardsContainer: SxStyleProp = {
  maxWidth: '1100px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  mt: ['16px', '32px'],
  mb: ['24px', '40px'],
  gap: '16px',
}

const button: SxStyleProp = {
  transition: 'all 0.3s ease-out',
}

const leftButtonContainer: SxStyleProp = {
  mt: '106px',
  display: ['none', 'none', 'none', 'none', 'none', 'block'],
}

const bottomButtonContainer: SxStyleProp = {
  display: ['block', 'block', 'block', 'block', 'block', 'none'],
  transition: 'all 0.3s ease-out',
}

export default {
  cardsContainer,
  sectionContainer,
  titleContainer,
  title,
  description,
  leftButtonContainer,
  bottomButtonContainer,
  button,
}
