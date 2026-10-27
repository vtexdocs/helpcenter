import { landingTokens } from '@vtexdocs/components'

const grays = {
  caretIcon: '#8A94A3',
  timelineRail: '#E7E9EE',
  dateLabel: '#7C879A',
  cardHoverBorder: landingTokens.cardHoverBorder,
}

const timeline = {
  dateColumnWidth: ['72px', '76px', '80px'] as const,
  dateColumnPaddingRight: ['8px', '10px'] as const,
  trackWidth: '20px',
  /** dateColumn width + track/2 − half of the 2px rail */
  railLeft: ['81px', '85px', '89px'] as const,
}

const landing = landingTokens

export default {
  grays,
  timeline,
  landing,
}
