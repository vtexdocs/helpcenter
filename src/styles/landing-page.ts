import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const grid: SxStyleProp = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: 0,
  width: '100%',
  background: '#ffffff',
}

const subscriptionList: SxStyleProp = {
  '& > div > :first-of-type': {
    fontSize: [
      `${landing.type.sectionTitle[0]} !important`,
      `${landing.type.sectionTitle[1]} !important`,
      `${landing.type.sectionTitle[2]} !important`,
      `${landing.type.sectionTitle[3]} !important`,
    ],
    lineHeight: [
      `${landing.type.sectionTitleLine[0]} !important`,
      `${landing.type.sectionTitleLine[1]} !important`,
      `${landing.type.sectionTitleLine[2]} !important`,
      `${landing.type.sectionTitleLine[3]} !important`,
    ],
    fontWeight: '400',
    color: `${landing.ink} !important`,
    letterSpacing: '-0.02em',
  },
}

export default {
  grid,
  subscriptionList,
}
