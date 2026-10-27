import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const sectionContainer: SxStyleProp = {
  width: '100%',
  maxWidth: landing.contentMaxWidth,
  px: [...landing.sectionPaddingX],
  pt: [...landing.sectionPaddingY],
  pb: ['40px', '56px', '64px'],
  margin: 'auto',
}

const title: SxStyleProp = {
  fontSize: [...landing.type.sectionTitle],
  lineHeight: [...landing.type.sectionTitleLine],
  fontWeight: '400',
  color: landing.ink,
  textAlign: 'center',
  letterSpacing: '-0.02em',
  mb: ['24px', '32px', '40px'],
}

export default {
  sectionContainer,
  title,
}
