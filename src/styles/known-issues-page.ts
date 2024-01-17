import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
}

const cardContainer: SxStyleProp = {
  gap: '16px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  mb: ['56px', '86px'],
}

const skeletonBox: SxStyleProp = {
  px: ['32px', '64px'],
  py: ['16px', '24px'],
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderRadius: '4px',
  height: '184px',
  width: ['320px', '544px', '720px'],
  backgroundColor: 'muted.1',

  '@keyframes skeleton-loading': {
    '0%': {
      backgroundColor: 'rgba(238, 238, 238, 0.3)',
    },
    '100%': {
      backgroundColor: 'rgba(238, 238, 238, 0.9)',
    },
  },
  animation: 'skeleton-loading 1s linear infinite alternate',
}

export default {
  container,
  cardContainer,
  skeletonBox,
}
