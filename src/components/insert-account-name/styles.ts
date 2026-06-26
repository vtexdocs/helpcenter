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
  },
  button: {} as SxStyleProp,
}

export default styles
