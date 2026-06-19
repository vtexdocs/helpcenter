import { useEffect, useMemo, useRef } from 'react'
import { Box } from '@vtex/brand-ui'

import { useDataTable } from './context'
import type { DataTableColumn, DataTableRow } from './datatable.types'
import styles from './styles'

interface DataTableProps {
  src: string
  columns?: DataTableColumn[]
}

type DataTablesInstance = { destroy: () => void }
type DataTablesConstructor = new (
  el: HTMLElement,
  options?: Record<string, unknown>
) => DataTablesInstance

const humanize = (key: string) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase())

const renderCell = (column: DataTableColumn, row: DataTableRow) => {
  const value = row[column.key]

  switch (column.type) {
    case 'link': {
      const href = column.urlKey ? (row[column.urlKey] as string) : undefined
      const label = value == null ? href : String(value)
      if (!href) return label ?? ''
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      )
    }
    case 'boolean':
      return value ? '✓' : '✗'
    case 'text':
    default:
      return value == null ? '' : String(value)
  }
}

const DataTable = ({ src, columns = [] }: DataTableProps) => {
  const table = useDataTable(src)
  const rows = table?.rows ?? []
  const cols = useMemo(() => (Array.isArray(columns) ? columns : []), [columns])
  const tableRef = useRef<HTMLTableElement>(null)

  const columnsKey = JSON.stringify(cols)

  useEffect(() => {
    const element = tableRef.current
    if (!element || cols.length === 0) return

    let instance: DataTablesInstance | null = null
    let cancelled = false

    const init = async () => {
      const DataTablesLib = (await import('datatables.net-dt'))
        .default as unknown as DataTablesConstructor
      if (cancelled || !tableRef.current) return

      const anyFilterable = cols.some((column) => column.filterable)
      instance = new DataTablesLib(tableRef.current, {
        searching: anyFilterable,
        ordering: true,
        paging: true,
        info: true,
        columnDefs: cols.map((column, index) => ({
          targets: index,
          orderable: Boolean(column.sortable),
          searchable: Boolean(column.filterable),
        })),
      })
    }

    init()

    return () => {
      cancelled = true
      instance?.destroy()
    }
  }, [src, columnsKey, rows])

  if (cols.length === 0) return null

  return (
    <Box sx={styles.container}>
      <table ref={tableRef} className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            {cols.map((column) => (
              <th key={column.key}>{column.label ?? humanize(column.key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {cols.map((column) => (
                <td key={column.key}>{renderCell(column, row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default DataTable
