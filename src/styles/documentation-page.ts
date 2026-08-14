import type { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

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
  lineHeight: '1.75em',
  width: ['100%', 'auto'],
  color: 'rgb(51, 65, 85)',
  a: {
    color: '#E31C58',
    textDecoration: 'none',
    fontWeight: '500',
  },
  ul: {
    pl: '1.5em',
    mt: '1.25em',
    mb: '1.25em',
    li: {
      mt: '0.5em',
      mb: '0.5em',
    },
    listStyleType: 'disc',
    'ul, ol': {
      mt: '0.5em',
      mb: '0.5em',
    },
  },
  ol: {
    pl: '1.5em',
    mt: '1.25em',
    mb: '1.25em',
    li: {
      mt: '0.5em',
      mb: '0.5em',
    },
    'ul, ol': {
      mt: '0.5em',
      mb: '0.5em',
    },
  },
  header: {
    marginTop: '16px',
    borderBottom: '1px solid #E7E9EE',
    marginBottom: '18px',
    pb: '18px',
  },
  h2: {
    fontSize: '1.375em',
    lineHeight: '1.3em',
    fontWeight: '700',
    mt: ['1.5em', '2em'],
    mb: ['0.75em', '1em'],
    overflowWrap: 'anywhere',
    color: 'rgb(15, 23, 42)',
  },
  h3: {
    fontSize: '1.125em',
    fontWeight: '600',
    lineHeight: '1.6em',
    mt: '1.6em',
    mb: '0.6em',
    overflowWrap: 'anywhere',
  },
  h4: {
    fontSize: '1em',
    fontWeight: '600',
    lineHeight: '1.5em',
    mt: '1.5em',
    mb: '0.5em',
    color: 'rgb(15, 23, 42)',
    overflowWrap: 'anywhere',
  },
  h5: {
    fontSize: '0.9375em',
    fontWeight: '600',
    lineHeight: '1.5em',
    mt: '1.25em',
    mb: '0.5em',
    color: 'rgb(71, 85, 105)',
    overflowWrap: 'anywhere',
  },
  h6: {
    fontSize: '0.9375em',
    fontWeight: '600',
    lineHeight: '1.5em',
    mt: '1.25em',
    mb: '0.5em',
    color: 'rgb(100, 116, 139)',
    overflowWrap: 'anywhere',
  },
  strong: {
    fontWeight: '600',
    overflowWrap: 'break-word',
  },
  hr: {
    border: '0.5px solid #E7E9EE',
    my: ['2em', '3em'],
  },
}

const contentContainer: SxStyleProp = {
  width: '100%',
  px: ['1.125em', 'initial'],
  minWidth: ['0px', '470px', '470px'],
}

const articleIndexContentContainer: SxStyleProp = {
  ...contentContainer,
  maxWidth: ['100%', '100%', '100%', '100%', '720px', '720px', '720px'],
}

const documentationTitle: SxStyleProp = {
  marginTop: '16px',
  fontSize: '1.75em',
  lineHeight: '1.15em',
  fontWeight: '400',
  color: '#142032',
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
  flexWrap: 'wrap',
  gap: '16px',
  mt: '32px',
}

const cardItem: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '16px 20px',
  border: '1px solid',
  borderColor: 'muted.3',
  borderRadius: '8px',
  cursor: 'pointer',
  width: [
    '100%',
    '100%',
    'calc(50% - 8px)',
    'calc(50% - 8px)',
    'calc(50% - 8px)',
    'calc(50% - 8px)',
    'calc(50% - 8px)',
  ],
  color: 'muted.0',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: 'muted.4',
    borderColor: tokens.grays.cardHoverBorder,
  },
}

const cardItemExcerpt: SxStyleProp = {
  mt: '6px',
  fontSize: '14px',
  lineHeight: '20px',
  color: 'muted.1',
}

export default {
  linksContainer,
  cardItem,
  cardItemExcerpt,
  articleIndexContentContainer,
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
