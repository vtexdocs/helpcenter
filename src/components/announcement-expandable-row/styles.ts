import { SxStyleProp } from '@vtex/brand-ui'

/** Linha inteira: data | marcador | conteúdo (tronco único via rail absoluto na página). */
const row: SxStyleProp = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'stretch',
  minHeight: '48px',
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  minWidth: 0,
  position: 'relative',
  zIndex: 1,
  mb: ['24px', '28px'],
}

/** Data à esquerda (changelog: MÊS + dia, maiúsculas) */
const dateColumn: SxStyleProp = {
  width: ['72px', '88px', '104px'],
  flexShrink: 0,
  pt: '3px',
  pr: ['10px', '12px'],
  textAlign: 'right',
  fontSize: ['11px', '12px'],
  fontWeight: '600',
  lineHeight: '1.25rem',
  letterSpacing: '0.04em',
  /** Mesma cor da data no `AnnouncementCard` da main (`date.large`). */
  color: '#A1AAB7',
  textTransform: 'uppercase',
  display: 'block',
}

const trackColumn: SxStyleProp = {
  width: '18px',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  pt: '3px',
}

const dot: SxStyleProp = {
  width: '12px',
  height: '12px',
  flexShrink: 0,
  borderRadius: '50%',
  borderWidth: '2px',
  borderStyle: 'solid',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 2,
}

const mainColumn: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  pl: ['12px', '16px'],
  pr: '4px',
}

const headerInteractive: SxStyleProp = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
  textAlign: 'left',
  font: 'inherit',
  outline: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  ':focus-visible': {
    boxShadow: '0 0 0 2px rgba(20, 32, 50, 0.2)',
    borderRadius: '4px',
  },
}

const headerStatic: SxStyleProp = {
  ...headerInteractive,
  cursor: 'default',
}

const caretWrap: SxStyleProp = {
  flexShrink: 0,
  pt: '4px',
  width: '20px',
  display: 'flex',
  justifyContent: 'center',
}

const textBlock: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-start',
}

const typeTagsContainer: SxStyleProp = {
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  mb: '4px',
}

const releaseTitle: SxStyleProp = {
  '& p': {
    /** Igual `styles.title.large` do `AnnouncementCard` na main. */
    mb: '8px',
    fontSize: ['14px', '20px'],
    color: 'muted.0',
    cursor: 'pointer',
    m: 0,
  },
}

const titleLink: SxStyleProp = {
  color: 'muted.0',
  textDecoration: 'none',
  ':hover': {
    /** Hover do card na main (`.title`). */
    color: '#000711',
    '& p': {
      color: '#000711',
    },
  },
}

const body: SxStyleProp = {
  mt: '12px',
  ml: ['30px', '34px'],
  fontSize: ['14px', '15px'],
  lineHeight: '22px',
  fontWeight: '400',
  /** Sinopse large na main: `muted.0` */
  color: 'muted.0',
  maxWidth: '100%',
  letterSpacing: '-0.01em',
}

export default {
  row,
  dateColumn,
  trackColumn,
  dot,
  mainColumn,
  headerInteractive,
  headerStatic,
  caretWrap,
  textBlock,
  typeTagsContainer,
  releaseTitle,
  titleLink,
  body,
}
