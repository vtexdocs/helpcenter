import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  width: '100%',
  backgroundColor: 'white',
}

const mainContainer: SxStyleProp = {
  justifyContent: 'center',
  width: '100%',
}

const innerContainer: SxStyleProp = {
  justifyContent: 'center',
  pt: ['28px', '64px'],
  mx: 'auto',
  px: ['auto', '5em', '7em', '7em', '7em', '7em', '20em'],
}

const articleBox: SxStyleProp = {
  fontSize: '1em',
  lineHeight: '1.375em',
  a: {
    color: '#E31C58',
  },
  header: {
    borderBottom: '1px solid #E7E9EE',
    marginBottom: '24px',
  },
  h1: {
    fontSize: '1.75em',
    fontWeight: '400',
    lineHeight: '2.375em',
    overflowWrap: 'anywhere',
  },
  h2: {
    fontSize: '1.375em',
    lineHeight: '2em',
    fontWeight: '400',
    mt: '1.3em',
    mb: '0.875em',
    overflowWrap: 'anywhere',
  },
  h3: {
    fontSize: '1.125em',
    fontWeight: '600',
    lineHeight: '1.875em',
    mt: '1.5em',
    mb: '1em',
    overflowWrap: 'anywhere',
  },
  strong: {
    fontWeight: '600',
    overflowWrap: 'anywhere',
  },
  hr: {
    border: '0.5px solid #E7E9EE',
  },
}

const contentContainer: SxStyleProp = {
  width: '100%',
  px: ['1.125em', 'initial'],
}

const documentationTitle: SxStyleProp = {
  marginTop: '16px',
  fontSize: ['20px', '28px'],
  lineHeight: ['30px', '38px'],
  fontWeight: '400',
}

const rightContainer: SxStyleProp = {
  ml: ['38px', '38px', '48px', '48px', '58px', '68px', '200px'],
  display: [
    'none !important',
    'none !important',
    'none !important',
    'none !important',
    'initial !important',
  ],
  minWidth: [0, 0, 0, 0, '139px', '184px', '284px'],
}

const releaseAction: SxStyleProp = {
  display: 'flex',
  gap: '10px',
  fontSize: '18px',
  mb: '8px',
}

const divider: SxStyleProp = {
  marginTop: '20px',
  borderBottom: '1px solid #E7E9EE',
}

const flexContainer: SxStyleProp = {
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  columnGap: ['8px', '16px'],
  alignItems: 'center',
  my: '20px',
}

const date: SxStyleProp = {
  ml: '48px',
}

const textContainer: SxStyleProp = {
  width: ['100%', '544px'],
  gap: '8px',
  pb: '43px',
  mb: '64px',
}

export default {
  container,
  mainContainer,
  articleBox,
  contentContainer,
  textContainer,
  documentationTitle,
  rightContainer,
  releaseAction,
  innerContainer,
  divider,
  flexContainer,
  date,
}
