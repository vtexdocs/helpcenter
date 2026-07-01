import type { TagColor } from '@vtexdocs/components'

export type DataTableColumnType =
  | 'text'
  | 'link'
  | 'boolean'
  | 'country'
  | 'code'
  | 'date'
  | 'number'
  | 'badge'
  | 'tag'
  | 'currency'

export interface DataTableColumn {
  key: string
  label?: string
  type?: DataTableColumnType
  /** For `currency`: ISO 4217 code (e.g. "BRL"). Defaults to "USD". Invalid codes fall back to plain number formatting. */
  currency?: string
  /** For `badge`/`tag`: map a cell value to a TagColor (e.g. `{ Active: 'Green', Deprecated: 'No_Fix' }`). */
  badgeColors?: Record<string, TagColor>
  sortable?: boolean
  filterable?: boolean
}

export type DataTableRow = Record<string, unknown>

export interface ResolvedDataTable {
  rows: DataTableRow[]
  updatedAt?: string
}

export type DataTablesData = Record<string, ResolvedDataTable>
