export type AnnouncementTagColor =
  | 'Fixed'
  | 'Closed'
  | 'Scheduled'
  | 'Gray'
  | 'Deprecation'
  | 'Backlog'

export const announcementTypeTagColorMap: Record<string, AnnouncementTagColor> =
  {
    'New feature': 'Fixed',
    Improvement: 'Closed',
    'Breaking change': 'Scheduled',
    Deprecation: 'Deprecation',
    'Security update': 'Backlog',
    'Nueva funcionalidad': 'Fixed',
    Mejora: 'Closed',
    'Cambio disruptivo': 'Scheduled',
    Descontinuación: 'Deprecation',
    'Actualización de seguridad': 'Backlog',
    'Nova funcionalidade': 'Fixed',
    Melhoria: 'Closed',
    Descontinuação: 'Deprecation',
    'Atualização de segurança': 'Backlog',
  }

export function filterAnnouncementTypeTags(
  tags: string[] | undefined
): string[] {
  const map = announcementTypeTagColorMap
  return (tags ?? []).filter((tag) => tag in map)
}

const announcementTypeDotColors: Record<
  AnnouncementTagColor,
  { backgroundColor: string; borderColor: string }
> = {
  Fixed: { backgroundColor: '#DFF5DB', borderColor: '#9FCDB4' },
  Closed: { backgroundColor: '#DEE8FE', borderColor: '#A5C0FF' },
  Scheduled: { backgroundColor: '#FFF3DA', borderColor: '#FFD581' },
  Gray: { backgroundColor: '#E7E9EE', borderColor: '#A1AAB7' },
  Deprecation: { backgroundColor: '#FCEAF2', borderColor: '#E8A5BE' },
  Backlog: { backgroundColor: '#E9E9E9', borderColor: '#D3D3D3' },
}

const neutralDot = {
  backgroundColor: '#C8CED6',
  borderColor: '#A1AAB7',
} as const

export function getAnnouncementTypeDotColors(tags: string[] | undefined): {
  backgroundColor: string
  borderColor: string
} {
  const typeTags = filterAnnouncementTypeTags(tags)
  const first = typeTags[0]
  if (!first) return neutralDot
  const key = announcementTypeTagColorMap[first]
  return announcementTypeDotColors[key] ?? neutralDot
}
