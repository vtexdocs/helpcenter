import type { SxStyleProp } from '@vtex/brand-ui'

const link: SxStyleProp = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  textDecoration: 'none',
}

const container: SxStyleProp = {
  px: ['20px', '32px', '36px', '48px'],
  py: ['20px', '24px'],
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

const topContainer: SxStyleProp = {
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
  width: '100%',
  minWidth: 0,
}

const title: SxStyleProp = {
  fontSize: ['16px', '18px', '20px'],
  fontWeight: '400',
  lineHeight: ['24px', '28px', '30px'],
  color: 'muted.0',
  overflowWrap: 'anywhere',
}

const knownIssueModule: SxStyleProp = {
  fontSize: ['14px', '16px'],
  fontWeight: '400',
  lineHeight: ['20px', '24px'],
  color: '#4A596B',
  overflowWrap: 'anywhere',
}

const linkContainer: SxStyleProp = {
  mt: '8px',
  alignItems: 'center',
}

const id: SxStyleProp = {
  fontSize: ['14px', '16px'],
  color: 'muted.1',
  overflowWrap: 'anywhere',
}

const datesContainer: SxStyleProp = {
  color: 'muted.1',
  width: '100%',
  minWidth: 0,
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '8px',
}

export default {
  link,
  container,
  title,
  id,
  topContainer,
  knownIssueModule,
  linkContainer,
  datesContainer,
}
