import { SxStyleProp } from '@vtex/brand-ui'

const cardContainer: SxStyleProp = {
  mt: ['16px', '24px', '24px', '32px'],
  px: ['16px', '24px', '24px', '48px'],
  py: ['16px', '64px', '64px'],
  justifyContent: 'center',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #E7E9EE',
  transition: 'all 0.3s ease-out',
  color: '#5E6E84',
  columnGap: '96px',
  rowGap: '64px',
  flexWrap: 'wrap',
}

const title: SxStyleProp = {
  fontSize: '22px',
  fontWeight: '400',
  lineHeight: '22px',
  gap: '10px',
  textAlign: 'top',
}

const description: SxStyleProp = {
  color: 'muted.1',
  fontSize: '16px',
  lineHeight: '22px',
  ml: '34px',
  mt: '4px',
}

const icon: SxStyleProp = {
  height: '18px',
  width: '18px',
  minWidth: '18px',
  minHeight: '18px',
}

const releaseContainer: SxStyleProp = {
  width: '100%',
}

const timelineContainer: SxStyleProp = {
  display: ['none', 'block', 'block', 'block', 'block', 'block'],
}

const timeLineBar: SxStyleProp = {
  '& > :first-of-type': {
    '& > :first-of-type': {
      '& > :first-of-type': {
        height: '16px',
        width: '16px',
      },
      mb: '4px',
    },
    '& > :nth-child(2)': {
      width: '1px',
      borderRadius: '0.5rem',
    },
    mr: '8px',
  },

  '& > :nth-of-type(2)': {
    padding: '0',
    '& > :nth-of-type(2)': {
      mt: '10px',
      mb: '32px',
    },
  },
}

const timelineTitle: SxStyleProp = {
  fontSize: '18px',
  transition: 'all .35s',
  color: '#5B6E84',
  ':hover': {
    color: '#142032',
  },
}

const content: SxStyleProp = {
  color: 'muted.1',
  fontSize: '16px',
  lineHeight: '22px',
  flexDirection: 'column',
}

const newTitle: SxStyleProp = {
  margin: '0',
  color: '#F71963',
  fontSize: '16px',
  lineHeight: '18px',
}

const placeholder: SxStyleProp = {
  height: '10px',
  width: '1px',
}

export default {
  cardContainer,
  title,
  description,
  icon,
  releaseContainer,
  timeLineBar,
  timelineTitle,
  newTitle,
  content,
  placeholder,
  timelineContainer,
}
