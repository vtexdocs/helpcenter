import type { SxStyleProp } from '@vtex/brand-ui'

const welcomeHeader: SxStyleProp = {
  pt: ['initial', '100px'],
  position: ['initial', 'absolute'],
  mb: ['32px', 'initial'],
  zIndex: '1000',
  left: [
    'auto',
    'max(16px, calc(50% - 544px / 2))',
    'max(16px, calc(50% - 544px / 2))',
    'max(16px, calc(50% - 544px / 2))',
    'max(16px, calc(50% - 720px / 2))',
    'max(16px, calc(50% - 720px / 2))',
    'max(16px, calc(50% - 1400px / 2))',
  ],
  width: ['100%', '345px', '345px', '345px', '345px', '720px'],
  maxWidth: ['100%', 'calc(100% - 32px)'],
  px: ['24px', 0],
  boxSizing: 'border-box',
}

const welcomeSubtitle: SxStyleProp = {
  textAlign: ['center', 'initial'],
  fontSize: ['16px', '18px'],
  fontWeight: '400',
  color: '#A1A8B3',
  lineHeight: ['24px', '26px'],
  overflowWrap: 'anywhere',
}

const welcomeOuterContainer: SxStyleProp = {
  overflow: 'hidden',
}

const welcomeInnerContainer: SxStyleProp = {
  flexDirection: ['column-reverse', 'row'],
  position: ['initial', 'relative'],
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  alignItems: ['center', 'initial'],
}

const welcomeText: SxStyleProp = {
  boxSizing: 'border-box',
  textAlign: ['center', 'initial'],
  fontSize: ['24px', '28px'],
  fontWeight: '400',
  lineHeight: ['32px', '36px'],
  paddingBottom: '8px',
  color: '#142032',
  overflowWrap: 'anywhere',
}

const welcomeImageOuterContainer: SxStyleProp = {
  width: '100%',
  overflow: 'hidden',
}

const welcomeImageInnerContainer: SxStyleProp = {
  position: 'relative',
  mx: ['auto', 'initial'],
  right: [
    'initial',
    '-308px',
    '-308px',
    '-308px',
    '-490px',
    '-621px',
    '-863px',
  ],
  top: ['-92px', '-122px'],
  width: ['min(500px, 100%)', '592px'],
  height: ['128px', '250px'],
}

const welcomeImageGradient: SxStyleProp = {
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: ['92px', '122px'],
  background: [
    'linear-gradient(180deg, rgba(255, 255, 255, 0) -3.42%, #FFFFFF 103.17%)',
    'linear-gradient(47.76deg, #FFFFFF -41.03%, rgba(255, 255, 255, 0) 28.93%)',
  ],
}

const divider: () => SxStyleProp = () => ({
  margin: 0,
  padding: 0,
  borderWidth: 0,
  borderBottom: '1px solid #E7E9EE',
  transition: 'width 0.3s ease-in-out',
  width: '100%',
})

export default {
  welcomeHeader,
  welcomeSubtitle,
  welcomeOuterContainer,
  welcomeInnerContainer,
  welcomeText,
  welcomeImageOuterContainer,
  welcomeImageInnerContainer,
  welcomeImageGradient,
  divider,
}
