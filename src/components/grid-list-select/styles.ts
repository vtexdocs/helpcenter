import { SxStyleProp } from '@vtex/brand-ui'

const selectContainer: SxStyleProp = {
  fontSize: '14px',
  border: '1px solid #E7E9EE',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '4px',
}

const select: SxStyleProp = {
  padding: '0px 4px',
  height: '24px',
  fontSize: '14px',
  outline: 'none',
}

const selected: SxStyleProp = {
  padding: '0px 4px',
  height: '24px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#CCCED8',
}

const button: SxStyleProp = {
  backgroundColor: 'white',
  border: 'none',
  padding: '0px',
  height: 'fit-content',

  ':hover': {
    backgroundColor: 'white',
  },
}

export default { selectContainer, select, selected, button }
