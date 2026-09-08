import type { SxStyleProp } from '@vtex/brand-ui'

const dropdownContainer: SxStyleProp = {
  display: 'flex',
  textTransform: 'none',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: 'calc(100% + 1px)',
  cursor: 'pointer',
  position: 'relative',
}

const dropdownButton: (active: boolean) => SxStyleProp = (active: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  px: '10px',
  borderRadius: '6px',
  color: active ? '#D71D55' : '#4A596B',
  backgroundColor: active ? '#FFF3F6' : 'transparent',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  svg: {
    mr: '8px',
    fill: 'none',
    path: {
      stroke: active ? '#D71D55' : '#4A596B',
    },
  },

  ':hover': {
    color: '#C81E51',
    backgroundColor: '#FFF3F6',
    'svg > path': {
      stroke: '#C81E51',
    },
  },
})

const rightButtonsText: SxStyleProp = {
  fontWeight: 'normal',
  fontSize: '13px',
  lineHeight: '22px',
  fontFamily: 'VTEX Trust Medium !important',
  textTransform: 'none',
}

export default {
  dropdownContainer,
  dropdownButton,
  rightButtonsText,
}
