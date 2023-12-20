import { SxStyleProp } from '@vtex/brand-ui'

const sectionContainer: SxStyleProp = {
  px: ['18px', '32px'],
  py: ['32px', '64px'],
  backgroundColor: 'muted.4',
  alignItems: 'center',
  flexDirection: 'column',
}

const title: SxStyleProp = {
  fontSize: ['20px', '28px', '28px', '40px'],
  lineHeight: ['30px', '38px', '38px', '50px'],
  fontWeight: '400',
  color: '#4A4A4A',
  textAlign: 'center',
}

const cardsContainer: SxStyleProp = {
  mt: ['16px', '40px'],
  flexDirection: 'column',
  alignItems: 'center',
  display: ['inline-block', 'inline-block', 'flex'],
  width: ['auto', 'auto', '100%'],
}

const button: SxStyleProp = {
  mt: ['31px', '60px', '60px', '54px', '69px', '58px'],
  display: ['block', 'block', 'block', 'block', 'block', 'none'],
  transition: 'all 0.3s ease-out',
}

export default {
  cardsContainer,
  sectionContainer,
  title,
  button,
}
