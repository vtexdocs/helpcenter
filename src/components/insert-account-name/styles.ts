import type { SxStyleProp } from '@vtex/brand-ui'

const styles: Record<string, SxStyleProp | React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    my: '16px',
  } as SxStyleProp,
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
  } as SxStyleProp,
  input: {
    width: '280px',
    height: '40px',
    padding: '0 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease-out',
  },
  inputError: {
    borderColor: '#E31C58',
    outline: 'none',
  },
  button: {
    height: '40px',
    padding: '0 16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    background: 'transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-out',
  },
  buttonHover: {
    background: '#F8F7FC',
    borderColor: '#5E6E84',
    color: '#E31C58',
  },
  errorText: {
    fontSize: '12px',
    color: '#E31C58',
  } as SxStyleProp,
}

export default styles
