import { SxStyleProp } from '@vtex/brand-ui'

const outerContainer: SxStyleProp = {
  // border: '1px solid red',
  gap: '64px',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '67px 300px 150px',
}

const titleContainer: SxStyleProp = {
  justifyText: 'left',
}

const pageTitle: SxStyleProp = {
  fontSize: '52px',
  color: 'black',
}

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
  outerContainer,
  titleContainer,
  pageTitle,
  section,
  sectionTitle,
  outerItemsContainer,
  innerItemsContainer,
}
