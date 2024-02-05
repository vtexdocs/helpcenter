import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  flexDirection: 'column',
  py: '48px',
  px: ['40px', '0px'],
  gap: '48px',
  width: '100%',
}

const innerContainer: SxStyleProp = {
  flexWrap: 'nowrap',
  overflowX: 'auto',
  gap: '22px',
}

const title: SxStyleProp = {
  fontSize: '20px',
  lineHeight: '30px',
  color: '#A1AAB7',
}

const button: SxStyleProp = {
  width: '119px',
  alignSelf: ['center', 'center', 'self-end'],
}

export default {
  container,
  innerContainer,
  title,
  button,
}
