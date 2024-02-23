import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  borderTop: '1px solid #E7E9EE',
  gap: '132px',
  pt: '24px',
  color: 'black',
}

const sectionTitle: SxStyleProp = {
  fontSize: '20px',
  width: '126px',
}

const outerItemsContainer: SxStyleProp = {
  // justifyContent: 'space-between',
  gap: '64px',
  flexWrap: 'wrap',
}

const innerItemsContainer: SxStyleProp = {
  width: '96px',
  flexDirection: 'column',
  gap: '24px',
  fontSize: '12px',
  color: '#4A596B',
}

export default {
  section,
  sectionTitle,
  outerItemsContainer,
  innerItemsContainer,
}
