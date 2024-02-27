import { SxStyleProp } from '@vtex/brand-ui'

const section: SxStyleProp = {
  borderTop: '1px solid #E7E9EE',
  gap: ['24px', '24px', '64px'],
  pt: '24px',
  color: 'black',
  flexDirection: ['column', 'column', 'row'],
}

const sectionTitle: SxStyleProp = {
  fontSize: '20px',
  width: '126px',
}

const outerItemsContainer: SxStyleProp = {
  gap: ['none', 'none', '64px'],
  flexWrap: 'wrap',
  flexDirection: ['column', 'column', 'row'],
  display: ['flex', 'flex', 'grid', 'grid', 'grid'],
  width: '100%',
  gridTemplateColumns: 'repeat(auto-fill, 96px)',
}

const innerItemsContainer: SxStyleProp = {
  width: '96px',
  flexDirection: ['column'],
  gap: '24px',
  fontSize: '12px',
  color: '#4A596B',
}

const link: SxStyleProp = {
  color: '#4A596B',
}

export default {
  section,
  sectionTitle,
  outerItemsContainer,
  innerItemsContainer,
  link,
}
