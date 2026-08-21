import type { SxStyleProp } from '@vtex/brand-ui'

/** Feedback is the first item to hide as the viewport shrinks. */
const FEEDBACK_VISIBLE_FROM = '1470px'
/** Below this, only HamburgerMenu and localeSwitcher remain in the header. */
const DESKTOP_NAV_FROM = '1024px'

const menuContainer: SxStyleProp = {
  display: 'flex',
  width: 'max-content',
}

const cardContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
}

const sideMenuContainer: SxStyleProp = {
  backgroundColor: '#ffff',
  height: 'calc(100vh - 5rem)',
  width: '100vw',
  overflowY: 'auto',
  overflowX: 'hidden',
  transform: 'translate(0)',
  transition: 'transform .5s cubic-bezier(.4,0,.2,1)',
}

const headerContainer: SxStyleProp = {
  position: 'sticky',
  top: 0,
  zIndex: 9999,
  width: '100%',
  transition: 'top 0.3s',
}

const headerBrand: SxStyleProp = {
  gridTemplateColumns: '1fr 1fr 0fr 1fr',
  width: '100%',
  maxWidth: '100%',
  position: 'relative',
}

const headerBrandLink: SxStyleProp = {
  width: 'fit-content',
  justifyContent: 'center',
  gridArea: 'brand',
  marginLeft: [4, 6, 6],
  marginBottom: 1,
  '> svg': {
    width: 'auto',
  },
}

const logoSize: SxStyleProp = {
  width: ['172px', '172px', '204px'],
  height: ['24px', '24px', '32px'],
}

const rightLinks: SxStyleProp = {
  display: ['flex !important'],
  width: '100%',
  height: '100%',
  textTransform: 'none',
  alignItems: 'center',
}

const rightLinksItem: SxStyleProp = {
  display: 'none !important',
  [`@media screen and (min-width: ${FEEDBACK_VISIBLE_FROM})`]: {
    display: 'flex !important',
  },
  visibility: 'visible',
  alignItems: 'center',
  padding: '0 !important',
  margin: '0 0 0 12px !important',
  svg: {
    mr: '2px',
  },

  ':hover': {
    color: '#C81E51',
    'svg > path': {
      stroke: '#C81E51',
    },
  },
}

const dropdownContainer: SxStyleProp = {
  display: 'none !important',
  [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
    display: 'flex !important',
  },
  textTransform: 'none',
  justifyContent: 'flex-end',
  height: 'calc(100% + 1px)',
  cursor: 'pointer',
}

const dropdownButton: (active: boolean) => SxStyleProp = (active: boolean) => ({
  color: active ? '#D71D55' : '#4A596B',
  alignItems: 'center',
  svg: {
    mr: '8px',
    fill: 'none',
    path: {
      stroke: active ? '#D71D55' : '#4A596B',
    },
  },

  ':hover': {
    color: '#C81E51',
    'svg > path': {
      stroke: '#C81E51',
    },
  },
})

const rightButtonsText: SxStyleProp = {
  fontWeight: 'normal',
  fontSize: '13px',
  lineHeight: '22px',
  fontFamily: 'VTEX Trust Medium !important',
  textTransform: 'none',
}

const iconContainer: SxStyleProp = { paddingLeft: 3, color: 'primary.base' }

const searchContainer: SxStyleProp = {
  display: ['none', 'none', 'none', 'flex'],
  justifyContent: 'center',
  paddingBlock: '18px',
  height: 'auto',
}

const searchIcon: SxStyleProp = {
  minWidth: '16px',
  minHeight: '16px',
  width: '16px',
  mr: '8px',
  flex: 0,
  maxWidth: 'fit-content',
}

const documentationContainer: SxStyleProp = {
  px: '16px',
  paddingBottom: '8px',
}

const updatesContainer: SxStyleProp = {
  px: '16px',
  paddingTop: '8px',
  borderRadius: '0px 0px 8px 8px',
  borderTop: '1px solid #E7E9EE',
}

const innerHambugerContainer: SxStyleProp = {
  padding: '0px',
  position: 'relative',
  overflowX: 'hidden',
}

const innerCardContainer: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const arrowIcon: SxStyleProp = {
  padding: '0',
  height: '50px',
  width: '50px',
  color: 'muted.1',
}

const arrowIconActive: SxStyleProp = {
  ...arrowIcon,
  color: '#D71D55',
}

const iconCell: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  width: '56px',
  minWidth: '56px',
  maxWidth: '56px',
  height: '100%',
  flexShrink: 0,
  [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
    width: 'auto',
    minWidth: 0,
    maxWidth: 'none',
  },
}

const localeSwitcherContainer: SxStyleProp = {
  ...iconCell,
  zIndex: 1,
  [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
    width: 'auto',
    minWidth: 0,
    maxWidth: 'none',
    paddingLeft: '20px',
    paddingRight: '12px',
  },
  '& button': {
    borderLeft: 'none !important',
    padding: '0 !important',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    lineHeight: 0,
    [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
      width: 'auto',
      height: '24px',
    },
  },
}

const containerHamburguerLocale: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingRight: 0,
  borderLeft: 'none',
  marginLeft: '0',
  gap: 0,
  [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
    borderLeft: '1px solid #e7e9ed',
    marginLeft: '32px',
  },

  '& > :first-of-type': {
    ...iconCell,
    '& button:first-of-type': {
      borderLeft: 'none !important',
      padding: '0px',
      width: '56px !important',
      minWidth: '56px',
      maxWidth: '56px',
      height: '100%',
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4A596B',
      svg: {
        rect: {
          fill: '#4A596B',
        },
      },
      ':hover': {
        color: '#C81E51',
        svg: {
          rect: {
            fill: '#C81E51',
          },
        },
      },
      [`@media screen and (min-width: ${DESKTOP_NAV_FROM})`]: {
        display: 'none !important',
      },
    },
  },
}

const splitter: SxStyleProp = {
  display: 'none',
}

export default {
  splitter,
  menuContainer,
  containerHamburguerLocale,
  cardContainer,
  sideMenuContainer,
  logoSize,
  headerContainer,
  headerBrand,
  headerBrandLink,
  searchContainer,
  searchIcon,
  rightLinks,
  iconContainer,
  rightLinksItem,
  rightButtonsText,
  dropdownButton,
  dropdownContainer,
  documentationContainer,
  updatesContainer,
  innerHambugerContainer,
  innerCardContainer,
  arrowIcon,
  arrowIconActive,
  localeSwitcherContainer,
}
