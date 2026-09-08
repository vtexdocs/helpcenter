import { SxStyleProp } from '@vtex/brand-ui'

const cardContainer: SxStyleProp = {
  my: ['16px', '16px', '16px', '16px', '16px', '16px', '24px'],
  padding: '8px',
  cursor: 'pointer',
  ':active, :hover': {
    borderRadius: '4px',
    backgroundColor: '#F8F7FC',

    '.description': {
      color: 'muted.0',
    },
  },

  ':active .title': {
    color: '#0C1522',
  },

  ':hover .title': {
    color: '#000711',
  },
}

const titleContainer: SxStyleProp = {
  alignItems: 'flex-start',
  gap: '12px',
}

const seeAlsoIcon: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#F4F5F7',
}

const title: SxStyleProp = {
  color: '#142032',
}

const description: SxStyleProp = {
  mt: '2px',
  fontSize: '12px',
  lineHeight: '16px',
  color: '#5E6E84',
}

export default {
  cardContainer,
  description,
  title,
  titleContainer,
  seeAlsoIcon,
}
