import { Button } from '@vtex/brand-ui'
import Tooltip from 'components/tooltip'
import { CopyIcon } from '@vtexdocs/components'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import styles from './styles'

export default function CopyLinkButton() {
  const intl = useIntl()
  const [tooltipText, setTooltipText] = useState(
    intl.formatMessage({ id: 'copy_link_button.text' })
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setTooltipText(intl.formatMessage({ id: 'copy_link_button.tooltip' }))

    setTimeout(() => {
      setTooltipText(intl.formatMessage({ id: 'copy_link_button.text' }))
    }, 2000)
  }

  return (
    <Tooltip label={tooltipText} placement="bottom">
      <Button onClick={handleCopy} sx={styles.copyLinkButton}>
        <CopyIcon sx={styles.copyIcon} size={16} />
      </Button>
    </Tooltip>
  )
}
