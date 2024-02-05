import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  width: '240px',
  height: '100%',
  padding: '16px 28px',
  gap: '8px',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',

  backgroundColor: '#FFFFFF',

  borderRadius: '4px',
  border: '1px solid #E7E9EE',
  wordBreak: 'break-word',

  transition: 'all 0.3s ease-out',
  ':hover': {
    cursor: 'pointer',
  },
  ':active, :hover': {
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3 ease-out',

    '.title': {
      transition: 'all 0.3s ease-out',
      color: '#000711',
    },
  },
}

const bottomContainer: SxStyleProp = {
  justifyContent: 'space-between',
  alignItems: 'center',
}

const title: SxStyleProp = {
  mb: '8px',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '16px',
  color: 'muted.0',
}

const linkContainer: SxStyleProp = {
  mt: '8px',
  alignItems: 'center',
}

const date: SxStyleProp = {
  fontSize: '12px',
  color: 'muted.1',
}

const tag: SxStyleProp = {
  height: '30px',
  width: '66px',
}

const link: SxStyleProp = {
  display: 'block',
  minWidth: '240px',
  width: '240px',
}

export default {
  container,
  title,
  date,
  bottomContainer,
  linkContainer,
  tag,
  link,
}
