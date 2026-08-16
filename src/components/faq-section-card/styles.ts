import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing, grays } = tokens

const cardContainer: SxStyleProp = {
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: ['auto', 'auto', '176px'],
  boxSizing: 'border-box',
  borderRadius: landing.cardRadius,
  border: `1px solid ${landing.border}`,
  transition:
    'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
  padding: ['16px', '20px'],
  backgroundColor: 'white',

  '.title, .description': {
    transition: 'color 0.2s ease',
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
  },
}

const infoContainer: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: 'white',
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
  mb: '8px',
  fontSize: landing.type.cardTitle,
  lineHeight: landing.type.cardTitleLine,
  fontWeight: '400',
  color: landing.ink,
  letterSpacing: '-0.01em',
}

const description: SxStyleProp = {
  fontSize: landing.type.cardBody,
  lineHeight: landing.type.cardBodyLine,
  fontWeight: '400',
  color: landing.muted,
  overflow: 'hidden',
  width: '100%',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
}

const typeContainer: SxStyleProp = {
  minHeight: '28px',
  paddingBottom: '12px',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderBottom: `1px solid ${landing.border}`,
  columnGap: '4px',
}

const type: SxStyleProp = {
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  fontWeight: '400',
  color: landing.muted,
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
