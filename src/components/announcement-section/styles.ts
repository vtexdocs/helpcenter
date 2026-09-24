import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const sectionContainer: SxStyleProp = {
  px: [...landing.sectionPaddingX],
  py: [...landing.sectionPaddingY],
  backgroundColor: 'muted.4',
  alignItems: 'center',
  flexDirection: 'column',
}

const title: SxStyleProp = {
  fontSize: [...landing.type.sectionTitle],
  lineHeight: [...landing.type.sectionTitleLine],
  fontWeight: '400',
  color: landing.ink,
  textAlign: 'center',
  letterSpacing: '-0.02em',
}

const cardsContainer: SxStyleProp = {
  flexDirection: 'column',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
  maxWidth: landing.contentMaxWidth,
}

const button: SxStyleProp = {
  transition: 'all 0.2s ease-out',
}

const buttonContainer: SxStyleProp = {
  mt: ['24px', '32px'],
  display: 'flex',
  justifyContent: 'center',
}

export default {
  cardsContainer,
  sectionContainer,
  title,
  button,
  buttonContainer,
}
