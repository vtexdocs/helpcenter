import { SxStyleProp } from '@vtex/brand-ui'
import { CSSProperties } from 'react'

const mainContainer: SxStyleProp = {
  width: '100%',
  mt: ['20px', '32px'],
  mb: ['24px', '52px'],
  maxWidth: '100%',
  minWidth: 0,
  borderTop: '1px solid #E7E9EE',
  pt: ['20px', '32px'],
}

const flexContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: ['16px', '16px'],
  width: '100%',
  minWidth: 0,
}

const paginationBox: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  padding: ['0', '16px'],
  borderRadius: ['0', '4px'],
  border: ['none', '1px solid #E7E9EE'],
  color: '#4A596B',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  ':hover': {
    border: ['none', '1px solid #CCCED8'],
    boxShadow: ['none', '0px 0px 16px rgba(0, 0, 0, 0.1)'],
    color: '#000711',
  },
}

const paginationBoxNext: SxStyleProp = {
  ...paginationBox,
  alignItems: 'flex-end',
  textAlign: 'right',
}

const paginationText: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
  fontSize: ['15px', '16px'],
  lineHeight: ['20px', '22px'],
  color: '#4A596B',
}

const subTitle: SxStyleProp = {
  color: '#A1A8B3',
  fontSize: ['12px', '0.85em'],
  lineHeight: '16px',
  fontWeight: '500',
  flexShrink: 0,
}

const linkReset: CSSProperties = {
  width: '100%',
  minWidth: 0,
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
}

const paginationLinkPrevious: SxStyleProp = {
  width: ['auto', '230px'],
  maxWidth: ['none', '230px'],
  minWidth: 0,
  flex: ['1 1 0', '0 0 auto'],
}

const paginationLinkNext: SxStyleProp = {
  width: ['auto', '230px'],
  maxWidth: ['none', '230px'],
  minWidth: 0,
  ml: 'auto',
  flex: ['1 1 0', '0 0 auto'],
}

export default {
  mainContainer,
  flexContainer,
  linkReset,
  paginationLinkNext,
  paginationLinkPrevious,
  paginationBox,
  paginationBoxNext,
  paginationText,
  subTitle,
}
