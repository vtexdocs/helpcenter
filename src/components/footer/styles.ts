import { SxStyleProp } from '@vtex/brand-ui'

const outerBox: SxStyleProp = {
  bg: '#142032;',
  display: ['flex'],
  flexDirection: ['column', 'row'],
  padding: '48px 32px 48px 48px',
  alignItems: ['flex-start', 'center'],
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  rowGap: '32px',
  overflow: ['initial'],
}

const socialMediaIcons: SxStyleProp = {
  gap: '16px',
  alignItems: 'center',
  paddingTop: '5px',
}

const textLinkItems: SxStyleProp = {
  fontSize: '16px',
  gap: ['48px', '30px', '45px'],
  rowGap: ['45px'],
  flexWrap: 'wrap',
  justifyItems: 'left',
  alignItems: 'center',
}

const localeSwitchLanding: SxStyleProp = {
  marginLeft: '0',
  justifySelf: 'left',
  positionBottom: '5px',
}

const icon: SxStyleProp = {
  size: 32,
  color: '#CCCED7',
  transition: 'all 0.3s ease-out',
  borderRadius: '50%',
  ':hover': {
    color: 'white',
    backgroundColor: 'rgba(204, 206, 215, 0.3)',
  },
}

export default {
  localeSwitchLanding,
  outerBox,
  socialMediaIcons,
  textLinkItems,
  icon,
}
