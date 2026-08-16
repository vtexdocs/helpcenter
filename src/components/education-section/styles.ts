import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const container: SxStyleProp = {
  pt: [...landing.sectionPaddingY],
  pb: [...landing.sectionPaddingY],
  px: [...landing.sectionPaddingX],
  backgroundColor: '#FFFFFF',
  borderTop: `1px solid ${landing.border}`,
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

const channelsContainer: SxStyleProp = {
  flexDirection: ['column', 'column', 'column', 'column', 'row'],
  justifyContent: 'center',
  alignItems: 'center',
}

export default {
  container,
  title,
  channelsContainer,
}
