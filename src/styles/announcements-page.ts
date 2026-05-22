import { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  mx: 'auto',
  mt: ['16px', '32px'],
  mb: ['32px', '64px'],
  alignItems: 'center',
  flexDirection: 'column',
  gap: '16px',
  width: ['320px', '545px', '545px', '720px'],
  maxWidth: '100vw',
}

const cardContainer: SxStyleProp = {
  gap: 0,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  mb: '56px',
  width: '100%',
}

/** Lista de itens do ano — o trilho fica só aqui para não atravessar o título. */
const yearTimelineBody: SxStyleProp = {
  position: 'relative',
  width: '100%',
  flexDirection: 'column',
}

/** Trilho do ano só entre as linhas (eixo alinhado à coluna de pontos). */
const yearVerticalRail: SxStyleProp = {
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  width: '2px',
  backgroundColor: '#E0E0E0',
  /** dateColumn width + trackColumn/2 − half line */
  left: ['80px', '96px', '112px'],
  top: 0,
  bottom: 0,
}

const optionsContainer: SxStyleProp = {
  justifyContent: ['center', 'flex-start'],
  alignItems: 'center',
  alignContent: 'center',
  gap: '24px',
  width: '100%',
  flexWrap: 'wrap',
}

const noResults: SxStyleProp = {
  py: '32px',
  textAlign: 'center',
}

/** Bloco por ano (changelog em coluna). */
const yearBlock: SxStyleProp = {
  width: '100%',
  flexDirection: 'column',
  gap: 0,
}

/** Quebra anual — alinhado ao eixo dos pontos (sem fundo nem máscara). */
const yearHeading: SxStyleProp = {
  fontFamily:
    "'VTEX Trust Regular', -apple-system, system-ui, BlinkMacSystemFont, sans-serif",
  fontSize: ['18px', '19px', '20px'],
  lineHeight: '1.2',
  fontWeight: '400',
  color: '#9AA3AE',
  width: 'auto',
  display: 'inline-block',
  /** dateColumn + metade do trackColumn (9px); alinha ao centro da linha de 2px. */
  position: 'relative',
  left: ['81px', '97px', '113px'],
  transform: 'translateX(-50%)',
  textAlign: 'center',
  mb: ['20px', '24px'],
  letterSpacing: '-0.01em',
}

const searchInput: SxStyleProp = {
  backgroundColor: '#F4F4F4',
  border: 'none',
  borderRadius: '4px',
  width: '100%',
  padding: '16px 24px',
  fontSize: '14px',
  lineHeight: '19px',
  transition: '0.3s',
  outline: 'none',
}

export default {
  container,
  cardContainer,
  yearTimelineBody,
  yearVerticalRail,
  optionsContainer,
  noResults,
  searchInput,
  yearBlock,
  yearHeading,
}
