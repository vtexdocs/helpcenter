import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  position: 'relative',
  height: '24px',
}

const button: SxStyleProp = {
  cursor: 'pointer',
  color: '#A1AAB7',
  height: '24px',
  transition: '0.3s',
  ':hover': {
    color: '#4A4A4A',
  },
}

const innerButton: SxStyleProp = {
  gap: '16px',
  color: '#A1AAB7',
  transition: '0.3s',
  ':hover': {
    color: '#4A4A4A',
  },
}

const innerContainer: SxStyleProp = {
  position: 'absolute',
  backgroundColor: 'white',
  flexDirection: 'column',
  top: '100%',
  mt: '8px',
  padding: '16px',
  gap: '16px',
  boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
}

const divider: SxStyleProp = {
  borderBottom: '1px solid #E7E9EE',
}

export default {
  container,
  button,
  innerButton,
  innerContainer,
  divider,
}
