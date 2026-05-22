import type { IntlShape } from 'react-intl'

import { announcementsTypeFilter, typeTagsByLocale } from './constants'

const TYPE_ORDER = [
  'new_feature',
  'improvement',
  'breaking_change',
  'deprecation',
  'security_update',
] as const

export type AnnouncementTypeFilterKey = (typeof TYPE_ORDER)[number]

function normalizeTagValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_')
}

/** Mapa estável: tag normalizada → tipo (aceita EN/PT/ES e chaves como new_feature). */
const NORMALIZED_TAG_TO_TYPE: Map<string, AnnouncementTypeFilterKey> = (() => {
  const map = new Map<string, AnnouncementTypeFilterKey>()
  for (const typeKey of TYPE_ORDER) {
    const register = (raw: string) => {
      if (!raw) return
      map.set(normalizeTagValue(raw), typeKey)
    }
    register(typeKey)
    register(typeKey.replace(/_/g, ' '))
    for (const locale of Object.keys(typeTagsByLocale)) {
      const row = typeTagsByLocale[locale] as Record<string, string>
      const label = row[typeKey]
      if (label) register(label)
    }
  }
  return map
})()

/**
 * Resolve o tipo do comunicado a partir de `tags` do frontmatter.
 * Aceita o label do idioma atual, labels de qualquer locale e chaves tipo `new_feature`.
 */
export function getAnnouncementTypeKey(
  tags: string[],
  intl: IntlShape
): AnnouncementTypeFilterKey | undefined {
  const cfg = announcementsTypeFilter(intl)
  for (let i = 0; i < cfg.options.length; i++) {
    if (tags.includes(cfg.options[i].id)) {
      return TYPE_ORDER[i]
    }
  }

  for (const tag of tags) {
    const trimmed = tag.trim()
    const byExact = NORMALIZED_TAG_TO_TYPE.get(normalizeTagValue(trimmed))
    if (byExact) return byExact
  }

  return undefined
}
