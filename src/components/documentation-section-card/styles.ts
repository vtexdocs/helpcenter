import { SxStyleProp } from '@vtex/brand-ui'

const cardContainer: SxStyleProp = {
  flexDirection: 'column',
  width: '282px',
  height: '293px',
  boxSizing: 'initial',
  borderRadius: '8px',
  border: '1px solid #E7E9EE',
  transition: 'all 0.3s ease-out',

  '.title, .description, .quickStartedContainer': {
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

    '.quickStartedContainer': {
      borderColor: 'muted.2',
    },

    '.title, .description, .quickStartedContainer': {
      transition: 'all 0.3s ease-out',
    },
  },
}

const infoContainer: SxStyleProp = {
  py: '24px',
  px: '16px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: '#FEFEFE',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  height: '100%',
}

const icon: SxStyleProp = {
  width: '24px',
  height: 'auto',
}

const title: SxStyleProp = {
  mt: ['8px'],
  mb: '8px',
  fontSize: '22px',
  lineHeight: '32px',
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
  height: '100%',
}

const quickStartedContainer: SxStyleProp = {
  height: '68px',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: '1px solid #E7E9EE',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  transition: 'all 0.3s ease-out',

  '.learnMoreText': {
    transition: 'all 0.3s ease-out',
  },

  ':active, :hover': {
    backgroundColor: '#F8F7FC',
    transition: 'all 0.3s ease-out',

    '.learnMoreText': {
      color: '#c81e51',
      transition: 'all 0.3s ease-out',
    },
  },
}

const learnMoreText: SxStyleProp = {
  fontSize: '16px',
  lineHeight: '22px',
  fontWeight: '400',
  color: '#e31c58',
  textDecoration: 'underline solid 1px',
}

const accessPortal: SxStyleProp = {
  columnGap: '5px',
  alignItems: 'center',
}

export default {
  cardContainer,
  description,
  icon,
  infoContainer,
  quickStartedContainer,
  learnMoreText,
  title,
  accessPortal,
}
