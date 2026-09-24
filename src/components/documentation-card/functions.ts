import { SxStyleProp } from '@vtex/brand-ui'
import styles from './styles'

const cardContainer = (containerType: string) => {
  const isSeeAlso = containerType === 'see-also'

  const cardContainer: SxStyleProp = {
    ...styles.cardContainer,
    ...(isSeeAlso
      ? {
          my: 0,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          height: '100%',
          padding: '12px 14px',
          borderRadius: '8px',
          border: '1px solid #E7E9EE',
          boxSizing: 'border-box',
          transition:
            'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
          ':active, :hover': {
            borderRadius: '8px',
            borderColor: '#CCCED8',
            backgroundColor: '#F8F7FC',
            boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.06)',
          },
          '.title, .description': {
            width: '100%',
            maxWidth: '100%',
          },
        }
      : {
          width:
            containerType === 'dropdown'
              ? ['308px', '442px', '444px', '480px']
              : '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }),
  }

  return cardContainer
}

const titleContainer = (containerType: string) => {
  const titleContainer: SxStyleProp = {
    ...styles.titleContainer,
    marginBottom: containerType === 'see-also' ? 0 : '8px',
  }

  return titleContainer
}

const cardTitle = (containerType: string) => {
  const titleAttributes =
    containerType === 'see-also'
      ? {
          fontSize: '15px',
          lineHeight: '22px',
          fontWeight: 500,
          whiteSpace: 'normal',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }
      : {
          fontSize: '16px',
          lineHeight: '22px',
        }

  const cardTitle: SxStyleProp = {
    ...styles.title,
    ...titleAttributes,
  }

  return cardTitle
}

export { cardContainer, cardTitle, titleContainer }
