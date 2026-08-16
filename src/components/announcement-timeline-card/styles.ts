import { SxStyleProp } from '@vtex/brand-ui'

import tokens from 'styles/theme-tokens'

const { landing } = tokens

const cardContainer: SxStyleProp = {
  width: '100%',
  px: ['20px', '28px', '40px'],
  py: ['24px', '36px', '48px'],
  justifyContent: 'space-between',
  alignItems: ['flex-start', 'flex-start', 'flex-start'],
  backgroundColor: 'white',
  borderRadius: landing.cardRadius,
  border: `1px solid ${landing.border}`,
  color: landing.muted,
  columnGap: ['32px', '48px', '72px'],
  rowGap: ['24px', '32px'],
  flexWrap: 'wrap',
}

const title: SxStyleProp = {
  fontSize: landing.type.cardTitle,
  lineHeight: landing.type.cardTitleLine,
  gap: '10px',
  alignItems: 'center',
  color: landing.ink,
  letterSpacing: '-0.01em',
}

const description: SxStyleProp = {
  color: landing.body,
  fontSize: landing.type.cardBody,
  lineHeight: landing.type.cardBodyLine,
  ml: '34px',
  mt: '8px',
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
  display: 'block',
  flex: 1,
  minWidth: ['100%', '100%', '280px'],
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
      mb: '28px',
    },
  },
}

const timelineTitle: SxStyleProp = {
  fontSize: landing.type.cardBody,
  lineHeight: landing.type.cardBodyLine,
  transition: 'color .2s ease',
  color: landing.body,
  ':hover': {
    color: landing.ink,
  },
}

const content: SxStyleProp = {
  color: landing.muted,
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  flexDirection: 'column',
}

const newTitle: SxStyleProp = {
  margin: '0',
  color: landing.pink,
  fontSize: landing.type.meta,
  lineHeight: landing.type.metaLine,
  fontWeight: '500',
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
