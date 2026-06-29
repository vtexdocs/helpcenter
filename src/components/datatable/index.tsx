import { useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import type { IntlShape } from 'react-intl'

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

interface CellData {
  content: ReactNode
  /** Value used by DataTables for ordering (rendered as `data-order`). */
  order?: string
  /** Value used by DataTables for searching (rendered as `data-search`). */
  search?: string
  align?: 'right'
}

const humanize = (key: string) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase())

const columnAlign = (column: DataTableColumn): 'right' | undefined =>
  column.type === 'number' || column.type === 'currency' ? 'right' : undefined

const flagEmoji = (code: string): string => {
  const cc = code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(cc)) return ''
  return cc.replace(/./g, (char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  )
}

const regionNamesCache = new Map<string, Intl.DisplayNames>()
const getRegionNames = (locale: string): Intl.DisplayNames => {
  let displayNames = regionNamesCache.get(locale)
  if (!displayNames) {
    try {
      displayNames = new Intl.DisplayNames([locale], { type: 'region' })
    } catch {
      displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
    }
    regionNamesCache.set(locale, displayNames)
  }
  return displayNames
}

const badgePalette = [
  { backgroundColor: '#E6F4EA', color: '#1E7E34' },
  { backgroundColor: '#FDECEA', color: '#C0392B' },
  { backgroundColor: '#E8F0FE', color: '#1A56DB' },
  { backgroundColor: '#FEF3DA', color: '#B7791F' },
  { backgroundColor: '#F3E8FD', color: '#8E44AD' },
  { backgroundColor: '#E0F7FA', color: '#00838F' },
  { backgroundColor: '#F1F3F4', color: '#5F6368' },
]

const hashString = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const badgeStyle = (
  value: string,
  overrides?: Record<string, string>
): { backgroundColor: string; color: string } => {
  if (overrides && overrides[value]) {
    return { backgroundColor: overrides[value], color: '#ffffff' }
  }
  return badgePalette[hashString(value.toLowerCase()) % badgePalette.length]
}

const getCellData = (
  column: DataTableColumn,
  row: DataTableRow,
  intl: IntlShape
): CellData => {
  const value = row[column.key]
  const isEmpty = value == null || value === ''

  switch (column.type) {
    case 'link': {
      const href = column.urlKey ? (row[column.urlKey] as string) : undefined
      const label = value == null ? href : String(value)
      if (!href) return { content: label ?? '' }
      return {
        content: (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ),
      }
    }

    case 'code': {
      if (isEmpty) return { content: '' }
      const text = String(value)
      return {
        content: <code className="dt-code">{text}</code>,
        order: text,
        search: text,
      }
    }

    case 'country': {
      if (isEmpty) return { content: '' }
      const code = String(value).trim().toUpperCase()
      const name = getRegionNames(intl.locale).of(code) ?? code
      const flag = flagEmoji(code)
      return {
        content: (
          <span className="dt-country">
            {flag ? <span aria-hidden="true">{flag}</span> : null}
            <span>{name}</span>
          </span>
        ),
        order: name,
        search: `${name} ${code}`,
      }
    }

    case 'date': {
      if (isEmpty) return { content: '' }
      const date = new Date(value as string | number)
      if (Number.isNaN(date.getTime())) {
        const text = String(value)
        return { content: text, order: text, search: text }
      }
      const formatted = intl.formatDate(date, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      return {
        content: formatted,
        order: String(date.getTime()),
        search: formatted,
      }
    }

    case 'number': {
      if (isEmpty) return { content: '', align: 'right' }
      const num = Number(value)
      if (Number.isNaN(num)) {
        const text = String(value)
        return { content: text, order: text, search: text, align: 'right' }
      }
      const formatted = intl.formatNumber(num)
      return {
        content: formatted,
        order: String(num),
        search: formatted,
        align: 'right',
      }
    }

    case 'currency': {
      if (isEmpty) return { content: '', align: 'right' }
      const num = Number(value)
      const currency =
        (column.currencyKey
          ? String(row[column.currencyKey] ?? '')
          : column.currency) || 'USD'
      if (Number.isNaN(num)) {
        const text = String(value)
        return { content: text, order: text, search: text, align: 'right' }
      }
      let formatted: string
      try {
        formatted = intl.formatNumber(num, { style: 'currency', currency })
      } catch {
        formatted = intl.formatNumber(num)
      }
      return {
        content: formatted,
        order: String(num),
        search: formatted,
        align: 'right',
      }
    }

    case 'badge':
    case 'tag': {
      if (isEmpty) return { content: '' }
      const text = String(value)
      return {
        content: (
          <span
            className="dt-badge"
            style={badgeStyle(text, column.badgeColors)}
          >
            {text}
          </span>
        ),
        order: text,
        search: text,
      }
    }

    case 'boolean': {
      const truthy = Boolean(value)
      return {
        content: truthy ? '✅' : '❌',
        order: truthy ? '1' : '0',
        search: truthy ? 'true' : 'false',
      }
    }

    case 'text':
    default:
      return { content: isEmpty ? '' : String(value) }
  }
}

const DataTable = ({ src, columns = [] }: DataTableProps) => {
  const intl = useIntl()
  const table = useDataTable(src)
  const rows = table?.rows ?? []
  const cols = useMemo(() => (Array.isArray(columns) ? columns : []), [columns])
  const tableRef = useRef<HTMLTableElement>(null)

  const columnsKey = JSON.stringify(cols)

  const language = useMemo(
    () => ({
      lengthMenu: intl.formatMessage({ id: 'datatable.lengthMenu' }),
      search: intl.formatMessage({ id: 'datatable.search' }),
      searchPlaceholder: '',
      info: intl.formatMessage({ id: 'datatable.info' }),
      infoEmpty: intl.formatMessage({ id: 'datatable.infoEmpty' }),
      infoFiltered: intl.formatMessage({ id: 'datatable.infoFiltered' }),
      zeroRecords: intl.formatMessage({ id: 'datatable.zeroRecords' }),
      emptyTable: intl.formatMessage({ id: 'datatable.emptyTable' }),
      paginate: {
        first: intl.formatMessage({ id: 'datatable.paginate.first' }),
        last: intl.formatMessage({ id: 'datatable.paginate.last' }),
        next: intl.formatMessage({ id: 'datatable.paginate.next' }),
        previous: intl.formatMessage({ id: 'datatable.paginate.previous' }),
      },
    }),
    [intl]
  )
  const languageKey = intl.locale

  useEffect(() => {
    if (!tableRef.current || cols.length === 0) return

    let instance: DataTablesInstance | null = null
    let cancelled = false

    const init = async () => {
      const DataTablesLib = (await import('datatables.net-dt'))
        .default as unknown as DataTablesConstructor
      if (cancelled || !tableRef.current) return

      const anyFilterable = cols.some((column) => column.filterable)
      const tableEl = tableRef.current
      instance = new DataTablesLib(tableEl, {
        language,
        searching: anyFilterable,
        ordering: true,
        paging: true,
        info: true,
        autoWidth: false,
        layout: {
          topStart: 'pageLength',
          topEnd: 'search',
          bottomStart: 'info',
          bottomEnd: 'paging',
        },
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
  }, [src, columnsKey, languageKey])

  if (cols.length === 0) return null
  if (!table) {
    console.error(
      `[DataTable] No data found for src="${src}". Check if the file exists in help-center-content.`
    )
    return null
  }

  const updatedAtDate = table.updatedAt ? new Date(table.updatedAt) : null
  const hasValidUpdatedAt =
    updatedAtDate !== null && !Number.isNaN(updatedAtDate.getTime())

  return (
    <Box sx={styles.container}>
      <table ref={tableRef} className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            {cols.map((column) => (
              <th
                key={column.key}
                style={
                  columnAlign(column) === 'right'
                    ? { textAlign: 'right' }
                    : undefined
                }
              >
                {column.label ?? humanize(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {cols.map((column) => {
                const cell = getCellData(column, row, intl)
                return (
                  <td
                    key={column.key}
                    data-order={cell.order}
                    data-search={cell.search}
                    style={
                      cell.align === 'right'
                        ? { textAlign: 'right' }
                        : undefined
                    }
                  >
                    {cell.content}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {hasValidUpdatedAt && updatedAtDate ? (
        <Box as="p" sx={styles.updatedAt}>
          {intl.formatMessage({ id: 'datatable.lastUpdated' })}{' '}
          {intl.formatDate(updatedAtDate, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Box>
      ) : null}
    </Box>
  )
}

export default DataTable
