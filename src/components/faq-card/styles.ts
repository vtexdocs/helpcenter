import type { SxStyleProp } from '@vtex/brand-ui'

const link: SxStyleProp = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  textDecoration: 'none',
}

const container: SxStyleProp = {
  px: ['20px', '32px', '36px', '64px'],
  py: ['20px', '24px'],
  display: 'flex',
  flexDirection: 'column',
  gap: ['12px', '16px'],
  borderRadius: '4px',
  border: '1px solid #E7E9EE',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  transition: 'all 0.3s ease-out',
  ':hover': {
    cursor: 'pointer',
  },
  ':active, :hover': {
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3 ease-out',

    '.title, .module': {
      transition: 'all 0.3s ease-out',
      color: '#000711',
    },
  },
}

const title: SxStyleProp = {
  fontSize: ['16px', '18px', '20px'],
  fontWeight: '400',
  lineHeight: ['24px', '28px', '30px'],
  color: 'muted.0',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
}

const tag: SxStyleProp = {
  width: 'max-content',
  maxWidth: '100%',
  px: '8px',
}

export default {
  link,
  container,
  title,
  tag,
}
