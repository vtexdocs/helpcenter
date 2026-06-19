export type DataTableColumnType = 'text' | 'link' | 'boolean'

export interface DataTableColumn {
  key: string
  label?: string
  type?: DataTableColumnType
  urlKey?: string
  sortable?: boolean
  filterable?: boolean
}

export type DataTableRow = Record<string, unknown>

export interface ResolvedDataTable {
  rows: DataTableRow[]
  updatedAt?: string
}

export type DataTablesData = Record<string, ResolvedDataTable>
