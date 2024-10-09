import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  px: ['32px', '32px', '36px', '64px'],
  py: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  borderRadius: '4px',
  border: '1px solid #E7E9EE',
  width: ['320px', '544px', '720px'],
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
  fontSize: ['14px', '20px'],
  fontWeight: '400',
  lineHeight: ['22px', '30px'],
  color: 'muted.0',
}

const tag: SxStyleProp = {
  width: 'max-content',
  px: '8px',
  margin: '4px',
}

const tagsContainer: SxStyleProp = {
  display: 'flex',
  flexWrap: 'wrap',
}

export default {
  container,
  title,
  tag,
  tagsContainer,
}
