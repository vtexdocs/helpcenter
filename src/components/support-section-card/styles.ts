import { SxStyleProp } from '@vtex/brand-ui'

const cardContainer: SxStyleProp = {
  flexDirection: 'column',
  width: '290px',
  height: '293px',
  boxSizing: 'initial',
  borderRadius: '8px',
  border: '1px solid #E7E9EE',
  transition: 'all 0.3s ease-out',

  ':active, :hover': {
    cursor: 'pointer',
    backgroundColor: 'white',
    borderColor: 'muted.2',
    transition: 'all 0.3s ease-out',

    '.titleContainer': {
      backgroundColor: '#363F4C',
    },

    '.quickStartedContainer': {
      borderColor: 'muted.2',
    },
  },
}

const titleContainer: SxStyleProp = {
  alignItems: 'center',
  flexDirection: 'column',
  py: '16px',
  backgroundColor: 'muted.0',
  color: 'white',
  transition: 'all 0.3s ease-out',
  rowGap: '10px',
  borderRadius: '8px 8px 0px 0px',
}

const infoContainer: SxStyleProp = {
  py: '24px',
  px: '24px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: '#FEFEFE',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  height: '157px',
}

const icon: SxStyleProp = {
  width: '24px',
  height: 'auto',
}

const title: SxStyleProp = {
  fontSize: '22px',
  lineHeight: '32px',
  fontWeight: '400',
}

const description: SxStyleProp = {
  fontSize: '16px',
  lineHeight: '22px',
  fontWeight: '400',
  color: 'muted.1',
  minHeight: '44px',
  overflow: 'hidden',
}

const quickStartedContainer: SxStyleProp = {
  height: '56px',
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
    transition: 'all 0.3s ease-out',

    '.learnMoreText': {
      color: '#000711',
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
  titleContainer,
  infoContainer,
  quickStartedContainer,
  learnMoreText,
  title,
  accessPortal,
}
