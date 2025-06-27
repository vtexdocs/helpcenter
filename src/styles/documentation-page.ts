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

const infoContainer: SxStyleProp = {
  flexDirection: 'row',
  // justifyContent: 'center',
  justifyContent: 'space-between',
  alignItems: 'space-between',
  pt: ['28px', '64px'],
  mx: '0',
  // px: ['auto', '5em', '7em', '7em', '7em', '7em', '20em'],
}

const articleBox: SxStyleProp = {
  fontSize: '1em',
  lineHeight: '1.375em',
  width: ['100%', 'auto'],
  a: {
    color: '#E31C58',
  },
  ul: {
    li: {
      mt: '0.5em',
      mb: '0.5em',
    },
  },
  ol: {
    li: {
      mt: '0.5em',
      mb: '0.5em',
    },
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
    overflowWrap: 'break-word',
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

const documentationExcerpt: SxStyleProp = {
  color: '#A1A8B3',
  padding: '8px 0 24px',
  lineHeight: '18px',
  fontWeight: '400',
}

const bottomContributorsContainer: SxStyleProp = {
  display: ['none', 'initial', 'initial', 'initial', 'none'],
}

const bottomContributorsDivider: SxStyleProp = {
  mx: 'auto',
  my: '32px',
  height: '1px',
  width: '162px',
  backgroundColor: '#E7E9EE',
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
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '16px',
  mb: '16px',
}

const detailedInfo: SxStyleProp = {
  justifyContent: 'space-between',
  flexDirection: 'column',
  py: '16px',
  gap: '8px',
}

const id: SxStyleProp = {
  justifyContent: 'space-between',
  fontSize: '20px',
  wordBreak: 'break-all',
}

const indexContainer: SxStyleProp = {
  borderTop: '1px solid #E7E9EE',
  gap: '32px',
}

const textContainer: SxStyleProp = {
  width: '100%',
  gap: '8px',
  pb: '43px',
  mb: '64px',
}

const titleContainer: SxStyleProp = {
  fontSize: '24px',
  color: '#4A4A4A',
  marginBottom: '8px',
}

const linksContainer: SxStyleProp = {
  flexDirection: 'column',
  pl: '16px',
  gap: '16px',
  mt: '32px',
  borderLeft: '3px solid #E7E9EE',
}

export default {
  linksContainer,
  titleContainer,
  textContainer,
  indexContainer,
  container,
  mainContainer,
  articleBox,
  contentContainer,
  documentationTitle,
  bottomContributorsContainer,
  bottomContributorsDivider,
  rightContainer,
  releaseAction,
  documentationExcerpt,
  innerContainer,
  infoContainer,
  divider,
  flexContainer,
  detailedInfo,
  id,
}
