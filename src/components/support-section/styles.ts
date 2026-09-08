import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const sectionContainer: SxStyleProp = {
  width: '100%',
  px: [...landing.sectionPaddingX],
  py: [...landing.sectionPaddingY],
  backgroundColor: 'white',
  borderTop: `1px solid ${landing.border}`,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
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

const contentCards: SxStyleProp = {
  display: 'grid',
  gridTemplateColumns: [
    '1fr',
    'repeat(2, minmax(0, 1fr))',
    'repeat(2, minmax(0, 1fr))',
    'repeat(4, minmax(0, 1fr))',
  ],
  width: '100%',
  maxWidth: landing.contentMaxWidth,
  gap: ['16px', '20px', '24px'],
}

export default {
  sectionContainer,
  contentCards,
  title,
}
