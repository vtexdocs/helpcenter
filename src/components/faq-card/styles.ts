import type { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing, grays } = tokens

const link: SxStyleProp = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  textDecoration: 'none',
}

const container: SxStyleProp = {
  px: ['16px', '20px'],
  py: ['16px', '18px'],
  flexDirection: 'column',
  gap: '10px',
  borderRadius: landing.cardRadius,
  border: `1px solid ${landing.border}`,
  backgroundColor: 'white',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    cursor: 'pointer',
    borderColor: grays.cardHoverBorder,
    boxShadow: landing.cardShadow,
    '.title': {
      color: landing.ink,
    },
  },
}

const title: SxStyleProp = {
  minWidth: 0,
  fontSize: ['16px', landing.type.cardTitle],
  fontWeight: '500',
  lineHeight: ['22px', landing.type.cardTitleLine],
  color: landing.ink,
  letterSpacing: '-0.01em',
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

const excerpt: SxStyleProp = {
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  fontWeight: '400',
  color: landing.muted,
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

const badgesRow: SxStyleProp = {
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: '8px',
  rowGap: '6px',
  width: '100%',
  minWidth: 0,
}

const tag: SxStyleProp = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '22px',
  lineHeight: '22px',
  px: '8px',
  maxWidth: '100%',
}

export default {
  link,
  container,
  title,
  excerpt,
  badgesRow,
  tag,
}
