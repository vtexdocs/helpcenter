import { Button } from '@vtex/brand-ui'
import Tooltip from 'components/tooltip'
import CopyIcon from 'components/icons/copy-icon'

import { useIntl } from 'react-intl'
import styles from './styles'

export default function CopyLinkButton() {
  const intl = useIntl()

  return (
    <Tooltip
      label={intl.formatMessage({ id: 'copy_link_button.tooltip' })}
      onClickTooltip={true}
      placement="bottom"
    >
      <Button
        onClick={() => {
          // Only run on client-side
          if (typeof window !== 'undefined' && navigator?.clipboard) {
            navigator.clipboard.writeText(window.location.href)
          }
        }}
        sx={styles.copyLinkButton}
      >
        {' '}
        <CopyIcon sx={styles.copyIcon} size={16} />{' '}
        {intl.formatMessage({ id: 'copy_link_button.text' })}{' '}
      </Button>
    </Tooltip>
  )
}
