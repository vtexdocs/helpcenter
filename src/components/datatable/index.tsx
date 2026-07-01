import { useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import type { IntlShape } from 'react-intl'
import { Tag } from '@vtexdocs/components'
import type { TagColor } from '@vtexdocs/components'

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
  align?: 'center'
  noWrap?: boolean
}

const humanize = (key: string) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase())

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

const TAG_COLOR_NAMES: TagColor[] = [
  'Blue',
  'Green',
  'Gray',
  'Scheduled',
  'Deprecation',
  'Closed',
  'No_Fix',
]

const hashString = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const resolveTagColor = (
  value: string,
  overrides?: Record<string, string>
): TagColor => {
  if (overrides?.[value]) return overrides[value] as TagColor
  return TAG_COLOR_NAMES[
    hashString(value.toLowerCase()) % TAG_COLOR_NAMES.length
  ]
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
      const lc = code.toLowerCase()
      return {
        content: (
          <span className="dt-country">
            <img
              src={`https://flagcdn.com/w20/${lc}.png`}
              srcSet={`https://flagcdn.com/w40/${lc}.png 2x`}
              width={20}
              height={15}
              alt={name}
            />
            <span>{name}</span>
          </span>
        ),
        order: name,
        search: `${name} ${code}`,
        noWrap: true,
      }
    }

    case 'date': {
      if (isEmpty) return { content: '' }
      const date = new Date(value as string | number)
      if (Number.isNaN(date.getTime())) {
        const text = String(value)
        return { content: text, order: text, search: text, noWrap: true }
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
        noWrap: true,
      }
    }

    case 'number': {
      if (isEmpty) return { content: '' }
      const num = Number(value)
      if (Number.isNaN(num)) {
        const text = String(value)
        return { content: text, order: text, search: text }
      }
      const formatted = intl.formatNumber(num)
      return {
        content: formatted,
        order: String(num),
        search: formatted,
      }
    }

    case 'currency': {
      if (isEmpty) return { content: '' }
      const num = Number(value)
      const currency =
        (column.currencyKey
          ? String(row[column.currencyKey] ?? '')
          : column.currency) || 'USD'
      if (Number.isNaN(num)) {
        const text = String(value)
        return { content: text, order: text, search: text }
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
      }
    }

    case 'badge':
    case 'tag': {
      if (isEmpty) return { content: '' }
      const text = String(value)
      return {
        content: (
          <Tag color={resolveTagColor(text, column.badgeColors)}>{text}</Tag>
        ),
        order: text,
        search: text,
        align: 'center',
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
  const instanceRef = useRef<DataTablesInstance | null>(null)

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
        first: '«',
        last: '»',
        next: '›',
        previous: '‹',
      },
    }),
    [intl]
  )
  const languageKey = intl.locale

  useEffect(() => {
    if (!tableRef.current || cols.length === 0) return

    let cancelled = false

    const init = async () => {
      const DataTablesLib = (await import('datatables.net-dt'))
        .default as unknown as DataTablesConstructor
      if (cancelled || !tableRef.current) return

      const anyFilterable = cols.some((column) => column.filterable)
      const tableEl = tableRef.current

      try {
        instanceRef.current = new DataTablesLib(tableEl, {
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
            className: 'dt-left',
            width: null,
          })),
        })
      } catch (error) {
        console.error('[DataTable] Error initializing DataTables:', error)
      }
    }

    init()

    return () => {
      cancelled = true
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy()
          instanceRef.current = null
        } catch (error) {
          console.error('[DataTable] Error destroying DataTables:', error)
        }
      }
    }
  }, [src, columnsKey, languageKey])

  if (cols.length === 0) return null
  if (!table) {
    console.error(
      `[DataTable] No data found for src="${src}". Check if the file exists in help-center-content.`
    )
    return (
      <Box sx={styles.unavailable}>
        <span aria-hidden="true">⚠️</span>{' '}
        {intl.formatMessage({ id: 'datatable.unavailable' })}
      </Box>
    )
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
              <th key={column.key}>{column.label ?? humanize(column.key)}</th>
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
                    style={{
                      textAlign: cell.align || 'left',
                      ...(cell.noWrap ? { whiteSpace: 'nowrap' as const } : {}),
                    }}
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
