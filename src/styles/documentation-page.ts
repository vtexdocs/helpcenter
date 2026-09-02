import type { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const container: SxStyleProp = {
  width: '100%',
  minWidth: 0,
  backgroundColor: 'white',
  maxWidth: '2024px',
  mx: 'auto',
}

const mainContainer: SxStyleProp = {
  justifyContent: 'center',
  width: '100%',
  minWidth: 0,
}

const innerContainer: SxStyleProp = {
  justifyContent: 'center',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  pt: ['24px', '32px', '3em'],
  mx: 'auto',
  px: ['18px', '24px', '32px', '40px', '48px', '64px', '20em'],
  pb: ['48px', '64px', '72px'],
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
  flex: '1 1 auto',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  color: 'rgb(51, 65, 85)',
  overflowWrap: 'anywhere',
  img: {
    maxWidth: '100%',
    height: 'auto',
  },
  pre: {
    maxWidth: '100%',
    overflowX: 'auto',
  },
  iframe: {
    maxWidth: '100%',
  },
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
  minWidth: 0,
  maxWidth: '100%',
}

const articleIndexContentContainer: SxStyleProp = {
  ...contentContainer,
  maxWidth: ['100%', '100%', '100%', '100%', '720px', '720px', '720px'],
}

const documentationTitle: SxStyleProp = {
  marginTop: '16px',
  fontSize: ['24px', '28px'],
  lineHeight: ['32px', '36px'],
  fontWeight: '400',
  color: '#142032',
  overflowWrap: 'anywhere',
}

const documentationExcerpt: SxStyleProp = {
  color: '#A1A8B3',
  padding: ['8px 0 16px', '8px 0 24px'],
  lineHeight: ['20px', '22px'],
  fontWeight: '400',
  overflowWrap: 'anywhere',
}

const breadcrumbRow: SxStyleProp = {
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '8px',
  width: '100%',
  minWidth: 0,
}

const articleMeta: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '8px',
  marginBottom: '24px',
  marginTop: '4px',
  width: '100%',
  minWidth: 0,
}

const readingTimeRow: SxStyleProp = {
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  width: '100%',
  minWidth: 0,
}

const articleActions: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  ml: 'auto',
  minWidth: 0,
  '& > div': {
    width: 'max-content',
    flexShrink: 0,
  },
  '& [role="menu"]': {
    right: 0,
  },
}

const articleFeedbackButton: SxStyleProp = {
  mt: 0,
  px: 3,
  minHeight: 36,
  background: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: 12,
  height: 'min-content',
  textTransform: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  width: 'max-content',
  maxWidth: '180px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  color: 'muted.0',
  border: '1px solid #E7E9EE',
  '&:hover': { backgroundColor: '#F8F7FC', color: '#000711' },
}

const knownIssueMeta: SxStyleProp = {
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100%',
  minWidth: 0,
  gap: '8px 12px',
  rowGap: '8px',
}

const bottomContributorsContainer: SxStyleProp = {
  display: ['flex', 'flex', 'flex', 'flex', 'none'],
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  pt: ['20px', '24px'],
  gap: ['24px', '24px'],
  '[data-cy="feedback-section"]': {
    marginTop: '0',
    marginBottom: '0',
    gap: '12px',
    '& > div:first-of-type': {
      borderBottom: 'none',
      paddingBottom: 0,
      marginBottom: 0,
      marginTop: 0,
    },
  },
}

const bottomContributors: SxStyleProp = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& > div': {
    alignItems: 'center !important',
    width: 'auto !important',
    mb: '0 !important',
  },
  '[data-cy="contributors-container"]': {
    display: 'flex !important',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 'auto !important',
    maxWidth: '232px',
  },
}

const rightContainer: SxStyleProp = {
  ml: [0, 0, 0, 0, '48px', '68px', '200px'],
  display: [
    'none !important',
    'none !important',
    'none !important',
    'none !important',
    'initial !important',
  ],
  flexShrink: 0,
  width: [0, 0, 0, 0, '240px', '240px', '284px'],
}

const releaseAction: SxStyleProp = {
  display: 'flex',
  gap: '10px',
  fontSize: '18px',
  mb: '8px',
}

const divider: SxStyleProp = {
  borderTop: '1px solid #E7E9EE',
  pt: 4,
  mt: 4,
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
  minWidth: 0,
  maxWidth: '100%',
  gap: '8px',
  pb: ['16px', '24px', '32px'],
  mb: ['8px', '24px', '48px'],
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

const editContainer: SxStyleProp = {
  my: 3,
  alignItems: 'center',
  gap: 2,
  fontSize: 12,
  ':hover': {
    color: '#000711 !important',
  },
  color: '#4A596B !important',
  display: 'flex',
}

const button: SxStyleProp = {
  mt: '8px',
  px: 3,
  minHeight: 36,
  background: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: 12,
  height: 'min-content',
  textTransform: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  width: '100%',
  color: 'muted.0',
  border: '1px solid #E7E9EE',
  '&:hover': { backgroundColor: '#F8F7FC', color: '#000711' },
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
  bottomContributors,
  rightContainer,
  releaseAction,
  documentationExcerpt,
  breadcrumbRow,
  articleMeta,
  readingTimeRow,
  articleActions,
  articleFeedbackButton,
  knownIssueMeta,
  innerContainer,
  infoContainer,
  divider,
  flexContainer,
  detailedInfo,
  id,
  editContainer,
  button,
}
