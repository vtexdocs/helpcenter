import { SxStyleProp } from '@vtex/brand-ui'
import { AnnouncementCardSize } from '.'

const container: SxStyleProp = {
  width: '100%',
  height: '100%',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',

  backgroundColor: '#FFFFFF',

  borderRadius: '4px',
  border: '1px solid #E7E9EE',
  wordBreak: 'break-word',

  transition: 'all 0.3s ease-out',
  ':hover': {
    cursor: 'pointer',
  },
  ':active, :hover': {
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3 ease-out',

    '.title': {
      transition: 'all 0.3s ease-out',
      color: '#000711',
    },
  },
}

const containerSpacing: { [size in AnnouncementCardSize]: SxStyleProp } = {
  small: {
    padding: '16px 28px',
    gap: '8px',
  },
  large: {
    padding: ['24px 32px', '24px 32px', '24px 36px', '24px 64px'],
    gap: '16px',
  },
}

const bottomContainer: SxStyleProp = {
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
}

const title: { [size in AnnouncementCardSize]: SxStyleProp } = {
  small: {
    mb: '8px',
    fontSize: '12px',
    lineHeight: '16px',
    color: 'muted.0',
  },
  large: {
    mb: '8px',
    fontSize: ['14px', '20px'],
    lineHeight: ['21px', '30px'],
    color: 'muted.0',
  },
}

const date: { [size in AnnouncementCardSize]: SxStyleProp } = {
  small: {
    fontSize: '12px',
    color: 'muted.1',
  },
  large: {
    fontSize: '16px',
    color: 'muted.1',
  },
}

const tag: SxStyleProp = {
  height: '20px',
  width: '66px',
}

const link: { [size in AnnouncementCardSize]: SxStyleProp } = {
  small: {
    display: 'block',
    minWidth: '240px',
    width: '240px',
  },
  large: {
    display: 'block',
    minWidth: '320px',
    width: ['320px', '545px', '545px', '720px'],
  },
}

const datesContainer: SxStyleProp = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}

export default {
  container,
  containerSpacing,
  title,
  date,
  bottomContainer,
  tag,
  link,
  datesContainer,
}
