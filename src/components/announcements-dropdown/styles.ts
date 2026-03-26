import { SxStyleProp } from '@vtex/brand-ui'

const outerContainer: SxStyleProp = {
  cursor: 'initial',
  top: 'calc(5rem - 1px)',
  position: 'absolute',
  filter: 'drop-shadow(0px 0px 16px rgba(0, 0, 0, 0.1))',
  borderRadius: '0px 0px 8px 8px',
  border: '1px solid #E7E9EE',
  background: 'white',
  minWidth: '420px',
  maxWidth: '480px',
  zIndex: -1,
  right: 0,
}

const innerContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
}

const header: SxStyleProp = {
  padding: '20px 20px 16px 20px',
}

const headerTitle: SxStyleProp = {
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: '16px',
  color: '#5E6E82',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const announcementsList: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '0 20px 20px 20px',
  maxHeight: '500px',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'white white',

  ':hover': {
    scrollbarColor: '#CCCED8 white',
  },
}

const announcementItem: SxStyleProp = {
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#F4F6F8',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',

  ':hover': {
    backgroundColor: '#E7E9EE',
    transform: 'translateY(-1px)',
  },
}

const authorName: SxStyleProp = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#5E6E82',
  fontWeight: '400',
}

const announcementTitle: SxStyleProp = {
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '20px',
  color: '#4A596B',
  marginTop: '2px',
  marginBottom: '1px',
}

const tagsContainer: SxStyleProp = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '8px',
}

const metaInfo: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '4px',
}

const newBadge: SxStyleProp = {
  display: 'inline-flex',
  alignItems: 'center',
}

const newIcon: SxStyleProp = {
  width: '14px',
  height: '14px',
}

const announcementDate: SxStyleProp = {
  fontSize: '16px',
  lineHeight: '22px',
  color: '#A1A8B3',
  fontWeight: '400',
}

const viewAllButton: SxStyleProp = {
  padding: '16px 20px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  borderTop: '1px solid #E7E9EE',

  ':hover': {
    backgroundColor: '#F8F9FA',
  },
}

const viewAllText: SxStyleProp = {
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: '16px',
  color: '#D71D55',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
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
  metaInfo,
  newBadge,
  newIcon,
  announcementDate,
  viewAllButton,
  viewAllText,
}
