import type { SxStyleProp } from '@vtex/brand-ui'

const breadcrumb: SxStyleProp = {
  alignItems: 'center',
  color: '#6b7785',
  mb: '24px',
  lineHeight: '18px',
  flexWrap: 'wrap',
}

const breadcrumbItem: SxStyleProp = {
  color: '#6b7785',
  ':hover': {
    color: '#5E6E84',
  },
}

export default { breadcrumb, breadcrumbItem }
