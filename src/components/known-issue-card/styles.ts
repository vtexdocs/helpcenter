import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  px: ['32px', '64px'],
  py: ['16px', '24px'],
  display: 'flex',
  flexDirection: 'column',
  gap: ['8px', '16px'],
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

const topContainer: SxStyleProp = {
  justifyContent: 'space-between',
  height: '30px',
  alignItems: 'center',
}

const title: SxStyleProp = {
  mb: '8px',
  fontSize: ['14px', '20px'],
  fontWeight: '400',
  lineHeight: ['22px', '30px'],
  color: 'muted.0',
}

const knownIssueModule: SxStyleProp = {
  fontSize: ['14px', '18px'],
  fontWeight: '400',
  lineHeight: ['16px', '30px'],
  color: '#4A596B',
}

const linkContainer: SxStyleProp = {
  mt: '8px',
  alignItems: 'center',
}

const id: SxStyleProp = {
  fontSize: ['14px', '16px'],
  color: 'muted.1',
}

export default {
  container,
  title,
  id,
  topContainer,
  knownIssueModule,
  linkContainer,
}