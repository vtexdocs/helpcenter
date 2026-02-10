import { SxStyleProp } from '@vtex/brand-ui'

const controlHeight = '48px'

const sectionContainer: SxStyleProp = {
  borderTop: '1px solid #e7e9ef',
  px: ['16px', '24px', '32px'],
  py: ['42px', '44px', '64px'],
  backgroundColor: 'muted.4',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const cardContainer: SxStyleProp = {
  mt: ['16px', '24px', '32px'],
  px: ['16px', '24px', '50px'],
  py: ['16px', '24px', '40px'],
  width: ['100%', '90%', '80%'],
  maxWidth: '1035px',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #E7E9EE',
}

const title: SxStyleProp = {
  fontSize: ['20px', '28px', '28px', '40px'],
  lineHeight: ['30px', '38px', '38px', '50px'],
  fontWeight: '400',
  color: '#4A4A4A',
  textAlign: 'center',
}

const description: SxStyleProp = {
  fontSize: ['14px', '16px'],
  lineHeight: ['20px', '22px'],
  textAlign: 'center',
  marginBottom: '16px',
}

const inputContainer: SxStyleProp = {
  display: 'flex',
  flexDirection: ['column', 'row'],
  gap: '5px',
  justifyContent: 'center',
  alignItems: ['center', 'flex-end'],
  width: '100%',
}

const emailInputField: SxStyleProp = {
  flex: 1,
  minWidth: 0,
  width: '100%',
  border: '1px solid #a1a8b3',
  borderRadius: '4px',
  color: '#4A4A4A',
  fontSize: '16px',
  lineHeight: '22px',
  px: '16px',
  py: 0,
  height: controlHeight,
  minHeight: controlHeight,
  boxSizing: 'border-box',
  '&::placeholder': {
    color: '#4A4A4A',
  },
  '&:focus': {
    outline: 'none',
    borderColor: '#A1A8B3',
  },
}

// Use the same base style as other landing CTAs (default @vtex/brand-ui Button),
// only nudging layout to align with the input height.
const button: SxStyleProp = {
  transition: 'all 0.3s ease-out',
  minHeight: controlHeight,
  height: controlHeight,
  alignSelf: ['center', 'stretch'],
  minWidth: '140px',
  whiteSpace: 'nowrap',
  px: '16px',
}

const privacyText: SxStyleProp = {
  fontSize: ['14px', '16px'],
  color: '#A1A8B3',
  lineHeight: ['16px', '22px'],
  pl: ['22px', '32px'],
  fontWeight: '400',
  margin: '16px',
}

const message = (isSuccess: boolean): SxStyleProp => ({
  backgroundColor: isSuccess ? 'lightgreen' : 'lightcoral',
  padding: '10px',
  borderRadius: '5px',
})

const popupCard: SxStyleProp = {
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  padding: ['8px', '12px'],
  boxSizing: 'border-box',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  marginTop: '16px',
  alignSelf: 'center',
}

export default {
  sectionContainer,
  cardContainer,
  title,
  description,
  inputContainer,
  emailInputField,
  button,
  privacyText,
  message,
  popupCard,
}
