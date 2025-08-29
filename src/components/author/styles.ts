import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  alignItems: 'center',
  columnGap: '16px',
  pt: '14px',
}

const titleContainer: SxStyleProp = {
  alignItems: 'center',
}

const title: SxStyleProp = {
  fontWeight: '400',
  fontSize: ['12px', '16px', '16px', '16px', '12px', '16px'],
  lineHeight: ['16px', '18px', '18px', '18px', '16px', '18px'],
  color: '#4A4A4A',
}

const photo: SxStyleProp = {
  width: '32px',
  height: '32px',
  img: {
    width: '32px',
    height: '32px',
    borderRadius: '100%',
  },
}

export default {
  container,
  titleContainer,
  title,
  photo,
}
