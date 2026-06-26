import type { SxStyleProp } from '@vtex/brand-ui'

const styles: Record<string, SxStyleProp> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    my: '16px',
  },
  input: {
    width: '280px',
  },
  button: {
    flexShrink: 0,
  },
}

export default styles
