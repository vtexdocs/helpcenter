import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing, grays } = tokens

const cardContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  minWidth: ['100%', '240px'],
  maxWidth: ['100%', '380px'],
  height: '100%',
  boxSizing: 'border-box',
  borderRadius: landing.cardRadius,
  border: `1px solid ${landing.border}`,
  backgroundColor: 'white',
  overflow: 'hidden',
  transition:
    'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
  '.title, .description, .quickStartedContainer': {
    transition: 'color 0.2s ease, border-color 0.2s ease',
  },

  ':active, :hover': {
    cursor: 'pointer',
    borderColor: grays.cardHoverBorder,
    boxShadow: landing.cardShadow,
    transform: 'translateY(-2px)',

    '.title': {
      color: landing.ink,
    },

    '.description': {
      color: landing.body,
    },

    '.quickStartedContainer': {
      borderColor: grays.cardHoverBorder,
    },
  },
}

const infoContainer: SxStyleProp = {
  py: '28px',
  px: '24px',
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
  mt: '12px',
  mb: '8px',
  fontSize: landing.type.cardTitle,
  lineHeight: landing.type.cardTitleLine,
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
  minHeight: '56px',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: `1px solid ${landing.border}`,
  backgroundColor: landing.surface,
  transition: 'background-color 0.2s ease, border-color 0.2s ease',

  '.learnMoreText': {
    transition: 'color 0.2s ease',
  },

  ':active, :hover': {
    '.learnMoreText': {
      color: landing.ink,
    },
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
  infoContainer,
  quickStartedContainer,
  learnMoreText,
  title,
  accessPortal,
}
