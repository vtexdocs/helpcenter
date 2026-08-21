import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const sectionContainer: SxStyleProp = {
  px: [...landing.sectionPaddingX],
  py: [...landing.sectionPaddingY],
  backgroundColor: 'white',
  borderTop: `1px solid ${landing.border}`,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

const titleContainer: SxStyleProp = {
  maxWidth: '640px',
  textAlign: 'center',
}

const title: SxStyleProp = {
  fontSize: [...landing.type.sectionTitle],
  lineHeight: [...landing.type.sectionTitleLine],
  mb: '12px',
  color: landing.ink,
  letterSpacing: '-0.02em',
}

const description: SxStyleProp = {
  fontSize: [...landing.type.sectionBody],
  lineHeight: [...landing.type.sectionBodyLine],
  fontWeight: '400',
  color: landing.body,
}

const cardsContainer: SxStyleProp = {
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr', 'repeat(2, minmax(0, 1fr))'],
  width: '100%',
  maxWidth: '900px',
  mt: ['24px', '32px', '40px'],
  mb: ['24px', '32px'],
  gap: '16px',
}

const button: SxStyleProp = {
  transition: 'all 0.2s ease-out',
}

export default {
  cardsContainer,
  sectionContainer,
  titleContainer,
  title,
  description,
  button,
}
