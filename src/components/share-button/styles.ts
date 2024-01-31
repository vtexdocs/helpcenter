import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  position: 'relative',
  height: '24px',
}

const button: SxStyleProp = {
  cursor: 'pointer',
  color: '#A1AAB7',
  width: '24px',
  height: '24px',
  transition: '0.3s',
  ':hover': {
    color: '#4A4A4A',
  },
}

const innerButton: SxStyleProp = {
  gap: '16px',
  color: '#A1AAB7',
  cursor: 'pointer',
  transition: '0.3s',
  ':hover': {
    color: '#4A4A4A',
  },
  alignItems: 'center',
}

const innerContainer: SxStyleProp = {
  position: 'absolute',
  backgroundColor: 'white',
  flexDirection: 'column',
  top: '100%',
  right: '0',
  mt: '8px',
  padding: '16px',
  gap: '16px',
  boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',

  ':before': {
    content: "''",
    position: 'absolute',
    top: '-8px',
    right: '8px',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '8px solid white',
    boxShadow: '0 16px 10px -17px rgba(0, 0, 0, 0.5)',
  },
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
