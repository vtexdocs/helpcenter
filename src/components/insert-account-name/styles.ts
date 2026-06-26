import type { SxStyleProp } from '@vtex/brand-ui'

const styles: Record<string, SxStyleProp | React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    my: '16px',
  } as SxStyleProp,
  input: {
    width: '280px',
    height: '40px',
    padding: '0 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
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
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
}

export default styles
