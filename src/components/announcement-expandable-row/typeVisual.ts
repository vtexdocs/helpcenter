import type { AnnouncementTypeFilterKey } from 'utils/getAnnouncementTypeKey'

export interface AnnouncementTypeVisual {
  dotFill: string
  dotBorder: string
  labelColor: string
}

const MAP: Record<AnnouncementTypeFilterKey, AnnouncementTypeVisual> = {
  new_feature: {
    dotFill: '#3A6E32',
    dotBorder: '#2d5628',
    labelColor: '#3A6E32',
  },
  improvement: {
    dotFill: '#E77809',
    dotBorder: '#C45E00',
    labelColor: '#C45E00',
  },
  breaking_change: {
    dotFill: '#CB2610',
    dotBorder: '#a81f0d',
    labelColor: '#CB2610',
  },
  deprecation: {
    dotFill: '#C8CED6',
    dotBorder: '#A1AAB7',
    labelColor: '#4A596B',
  },
  security_update: {
    dotFill: '#0F766E',
    dotBorder: '#0d655e',
    labelColor: '#0F766E',
  },
}

const DEFAULT: AnnouncementTypeVisual = {
  dotFill: '#C8CED6',
  dotBorder: '#A1AAB7',
  labelColor: '#5B6E84',
}

export function getAnnouncementTypeVisual(
  key: AnnouncementTypeFilterKey | undefined
): AnnouncementTypeVisual {
  if (key && MAP[key]) {
    return MAP[key]
  }
  return DEFAULT
}
