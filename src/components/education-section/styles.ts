import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const container: SxStyleProp = {
  pt: ['24px', '32px', '48px'],
  pb: ['24px', '32px', '48px'],
  px: [...landing.sectionPaddingX],
  backgroundColor: landing.ink,
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
}

const title: SxStyleProp = {
  fontSize: [...landing.type.sectionTitle],
  lineHeight: [...landing.type.sectionTitleLine],
  fontWeight: '500',
  color: '#FFFFFF',
  textAlign: 'left',
  letterSpacing: '-0.02em',
  mb: ['20px', '24px'],
}

const channelsContainer: SxStyleProp = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: ['8px', '12px'],
}

const button: SxStyleProp = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  px: ['16px', '20px'],
  py: ['8px', '10px'],
  borderRadius: '9999px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#FFFFFF',
  fontSize: ['14px', '16px'],
  lineHeight: ['20px', '22px'],
  fontWeight: '400',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    color: '#FFFFFF',
  },
}

const buttonIcon: SxStyleProp = {
  width: '14px',
  height: '14px',
  minWidth: '14px',
  minHeight: '14px',
  flexShrink: 0,
}

export default {
  container,
  title,
  channelsContainer,
  button,
  buttonIcon,
}
