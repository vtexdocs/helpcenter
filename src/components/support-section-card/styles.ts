import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing, grays } = tokens

const cardContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  borderRadius: landing.cardRadius,
  border: `1px solid ${landing.border}`,
  backgroundColor: 'white',
  overflow: 'hidden',
  transition:
    'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',

  ':active, :hover': {
    cursor: 'pointer',
    borderColor: grays.cardHoverBorder,
    boxShadow: landing.cardShadow,
    transform: 'translateY(-2px)',

    '.title': {
      color: landing.ink,
    },

    '.quickStartedContainer': {
      borderColor: grays.cardHoverBorder,
    },
    '.learnMoreText': {
      color: landing.ink,
    },
  },
}

const titleContainer: SxStyleProp = {
  alignItems: 'center',
  flexDirection: 'column',
  pt: '24px',
  px: '20px',
  pb: '8px',
  color: landing.ink,
  rowGap: '12px',
}

const infoContainer: SxStyleProp = {
  py: '8px',
  px: '20px',
  pb: '20px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  backgroundColor: 'white',
  flex: 1,
}

const icon: SxStyleProp = {
  width: '28px',
  height: 'auto',
  color: landing.body,
  path: {
    stroke: landing.body,
  },
}

const title: SxStyleProp = {
  fontSize: landing.type.cardTitle,
  lineHeight: landing.type.cardTitleLine,
  textAlign: 'center',
  color: landing.ink,
  letterSpacing: '-0.01em',
}

const description: SxStyleProp = {
  fontSize: landing.type.cardBody,
  lineHeight: landing.type.cardBodyLine,
  color: landing.muted,
  overflow: 'hidden',
}

const quickStartedContainer: SxStyleProp = {
  minHeight: '52px',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: `1px solid ${landing.border}`,
  backgroundColor: landing.surface,
  transition: 'border-color 0.2s ease',

  '.learnMoreText': {
    transition: 'color 0.2s ease',
  },
}

const learnMoreText: SxStyleProp = {
  fontSize: landing.type.cardCta,
  lineHeight: landing.type.cardCtaLine,
  fontWeight: '500',
  color: landing.body,
  textDecoration: 'none',
}

const accessPortal: SxStyleProp = {
  columnGap: '6px',
  alignItems: 'center',
  color: landing.body,
  svg: {
    color: 'inherit',
  },
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
