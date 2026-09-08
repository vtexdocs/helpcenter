import { SxStyleProp } from '@vtex/brand-ui'

const selectContainer: SxStyleProp = {
  flexWrap: 'wrap',
  columnGap: '16px',
  rowGap: '8px',
  alignItems: 'center',
  fontSize: '14px',
  minWidth: 0,
  maxWidth: '100%',
}

const select: SxStyleProp = {
  borderRadius: '4px',
  padding: '0px 4px',
  height: '24px',
  fontSize: '14px',
  border: '1px solid #E7E9EE',
  outline: 'none',
  maxWidth: '100%',
  minWidth: 0,
}

export default { selectContainer, select }
