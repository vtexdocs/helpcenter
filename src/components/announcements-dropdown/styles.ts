import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing, grays } = tokens

const outerContainer: SxStyleProp = {
  cursor: 'initial',
  top: 'calc(5rem - 1px)',
  right: 0,
  position: 'absolute',
  boxShadow: landing.cardShadow,
  borderRadius: '0px 0px 8px 8px',
  border: `1px solid ${landing.border}`,
  background: 'white',
  width: '420px',
  maxWidth: 'min(420px, calc(100vw - 32px))',
  zIndex: -1,
  overflow: 'hidden',
}

const innerContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
}

const header: SxStyleProp = {
  px: '20px',
  pt: '16px',
  pb: '8px',
}

const headerTitle: SxStyleProp = {
  fontSize: landing.type.meta,
  fontWeight: '600',
  lineHeight: landing.type.metaLine,
  color: landing.muted,
  letterSpacing: '0.02em',
}

const announcementsList: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  px: '8px',
  pb: '8px',
  maxHeight: 'calc(100vh - 5rem - 160px)',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  scrollbarWidth: 'thin',
  scrollbarColor: 'white white',

  ':hover': {
    scrollbarColor: '#CCCED8 white',
  },
}

const announcementItem: SxStyleProp = {
  padding: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textDecoration: 'none',
  color: 'inherit',

  ':hover': {
    backgroundColor: landing.surface,

    '.title': {
      color: landing.ink,
    },

    '.date': {
      color: landing.muted,
    },
  },
}

const authorName: SxStyleProp = {
  fontSize: '12px',
  lineHeight: '16px',
  color: landing.muted,
  fontWeight: '400',
}

const announcementTitle: SxStyleProp = {
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '22px',
  color: landing.body,
  letterSpacing: '-0.01em',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  transition: 'color 0.2s ease',
}

const tagsContainer: SxStyleProp = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
  alignItems: 'center',
}

const metaRow: SxStyleProp = {
  alignItems: 'center',
  gap: '8px',
}

const announcementDate: SxStyleProp = {
  fontSize: '12px',
  lineHeight: '16px',
  color: grays.dateLabel,
  fontWeight: '400',
  transition: 'color 0.2s ease',
}

const viewAllButton: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  px: '20px',
  py: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  borderTop: `1px solid ${landing.border}`,
  textDecoration: 'none',
  color: landing.pink,

  ':hover': {
    backgroundColor: landing.surface,
    color: landing.pinkHover,

    svg: {
      transform: 'translateX(2px)',
    },

    'svg > path': {
      stroke: landing.pinkHover,
    },
  },
}

const viewAllText: SxStyleProp = {
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '20px',
  letterSpacing: '-0.01em',
}

const viewAllIcon: SxStyleProp = {
  flexShrink: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  transition: 'transform 0.2s ease',

  path: {
    stroke: landing.pink,
    transition: 'stroke 0.2s ease',
  },
}

export default {
  outerContainer,
  innerContainer,
  header,
  headerTitle,
  announcementsList,
  announcementItem,
  authorName,
  announcementTitle,
  tagsContainer,
  metaRow,
  announcementDate,
  viewAllButton,
  viewAllText,
  viewAllIcon,
}
