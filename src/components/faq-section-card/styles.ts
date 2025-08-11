import { SxStyleProp } from '@vtex/brand-ui'

const cardContainer: SxStyleProp = {
  flexDirection: 'column',
  width: ['292px', '292px', '441px', '441px', '441px', '441px', '441px'],
  height: ['84px', '84px', '172px'],
  boxSizing: 'initial',
  borderRadius: '8px',
  border: '1px solid #E7E9EE',
  transition: 'all 0.3s ease-out',
  padding: '16px',
  backgroundColor: 'white',

  '.title, .description, .typeContainer': {
    transition: 'all 0.3s ease-out',
  },

  ':active, :hover': {
    cursor: 'pointer',
    backgroundColor: 'white',
    borderColor: 'muted.2',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-out',

    '.title': {
      color: '#000711',
    },

    '.description': {
      color: 'muted.0',
    },

    '.typeContainer': {
      borderColor: 'muted.2',
    },

    '.title, .description, .typeContainer': {
      transition: 'all 0.3s ease-out',
    },

    '.type': {
      color: '#F71963',
      transition: 'all 0.3s ease-out',
    },

    '.icon': {
      color: '#F71963',
      transition: 'all 0.3s ease-out',
    },
  },
}

const infoContainer: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'start',
  backgroundColor: '#FEFEFE',
  height: '100%',
}

const icon: SxStyleProp = {
  width: ['12px', '12px', '18px'],
  minHeight: '12px',
  minWidth: '12px',
  height: 'auto',
}

const title: SxStyleProp = {
  mt: '12px',
  mb: '12px',
  fontSize: ['16px', '16px', '22px'],
  lineHeight: ['22px', '22px', '32px'],
  fontWeight: '400',
  color: 'muted.0',
}

const description: SxStyleProp = {
  fontSize: '16px',
  lineHeight: '22px',
  fontWeight: '400',
  color: 'muted.1',
  minHeight: '44px',
  overflow: 'hidden',
  width: '100%',
  height: '50%',
  display: ['none', 'none', 'block', 'block', 'block', 'block', 'block'],
}

const typeContainer: SxStyleProp = {
  height: '30px',
  paddingBottom: '12px',
  justifyContent: 'left',
  alignItems: 'center',
  borderBottom: '1px solid #E7E9EE',
  transition: 'all 0.3s ease-out',
  columnGap: '4px',
}

const type: SxStyleProp = {
  fontSize: ['12px', '12px', '16px'],
  lineHeight: '18px',
  fontWeight: '400',
  color: '#5E6E84',
}

export default {
  cardContainer,
  description,
  icon,
  infoContainer,
  typeContainer,
  type,
  title,
}
