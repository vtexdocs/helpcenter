import { SxStyleProp } from '@vtex/brand-ui'

const outerContainer: SxStyleProp = {
  padding: [
    '50px 27px 64px',
    '54px 50px 64px',
    '64px 101px 64px',
    '47px 42px 64px',
    '47px 300px 64px',
  ],
}

const titleContainer: SxStyleProp = {
  justifyText: 'left',
  pb: '64px',
}

const pageTitle: SxStyleProp = {
  fontSize: '52px',
  color: 'black',
}

const contentContainer: SxStyleProp = {
  flexDirection: 'column',
  gap: ['24px', '24px', '24px', '24px', '24px', '64px'],
}

export default {
  outerContainer,
  titleContainer,
  pageTitle,
  contentContainer,
}
