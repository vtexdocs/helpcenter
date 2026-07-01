import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import type { ReactNode } from 'react'
import { Box } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import type { IntlShape } from 'react-intl'
import { Tag, SearchIcon } from '@vtexdocs/components'
import type { TagColor } from '@vtexdocs/components'

import { useDataTable } from './context'
import type { DataTableColumn, DataTableRow } from './datatable.types'
import MultiSelect from 'components/multi-select'
import styles from './styles'

interface DataTableProps {
  src: string
  columns?: DataTableColumn[]
}

type DataTablesSearchOptions = { regex?: boolean; smart?: boolean }
type DataTablesColumnApi = {
  search: (val: string, opts?: DataTablesSearchOptions) => { draw: () => void }
}
type DataTablesInstance = {
  destroy: () => void
  search: (val: string) => { draw: () => void }
  column: (index: number) => DataTablesColumnApi
}
// Intentionally narrowed to HTMLElement — selector strings are not used.
type DataTablesConstructor = new (
  el: HTMLElement,
  options?: Record<string, unknown>
) => DataTablesInstance

// Module-level promise so the DataTables bundle is only loaded once.
let dtImport: Promise<DataTablesConstructor> | null = null
const loadDataTables = (): Promise<DataTablesConstructor> => {
  if (!dtImport) {
    dtImport = import('datatables.net-dt').then(
      (m) => m.default as unknown as DataTablesConstructor
    )
  }
  return dtImport
}

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

// Cache is capped at 20 entries to avoid unbounded growth in long-running envs.
const MAX_LOCALE_CACHE = 20
const regionNamesCache = new Map<string, Intl.DisplayNames>()
const getRegionNames = (locale: string): Intl.DisplayNames => {
  let displayNames = regionNamesCache.get(locale)
  if (!displayNames) {
    try {
      displayNames = new Intl.DisplayNames([locale], { type: 'region' })
    } catch {
      displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
    }
    if (regionNamesCache.size >= MAX_LOCALE_CACHE) {
      regionNamesCache.delete(regionNamesCache.keys().next().value as string)
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
  const override = overrides?.[value]
  if (override && (TAG_COLOR_NAMES as string[]).includes(override)) {
    return override as TagColor
  }
  return TAG_COLOR_NAMES[
    hashString(value.toLowerCase()) % TAG_COLOR_NAMES.length
  ]
}

const SAFE_HREF = /^https?:\/\//i

const getCellData = (
  column: DataTableColumn,
  row: DataTableRow,
  intl: IntlShape
): CellData => {
  const value = row[column.key]
  const isEmpty = value == null || value === ''

  switch (column.type) {
    case 'link': {
      if (isEmpty) return { content: '' }
      const raw = String(value)
      const mdMatch = raw.match(/^\[(.+?)\]\((.+?)\)$/)
      const href = mdMatch ? mdMatch[2] : raw
      const label = mdMatch ? mdMatch[1] : raw
      if (!SAFE_HREF.test(href)) return { content: raw }
      return {
        content: (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ),
        search: label,
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
      // Only render the flag image for valid ISO 3166-1 alpha-2 codes.
      const validCode = /^[A-Z]{2}$/.test(code)
      const lc = code.toLowerCase()
      return {
        content: (
          <span className="dt-country">
            {validCode && (
              <img
                src={`https://flagcdn.com/w20/${lc}.png`}
                srcSet={`https://flagcdn.com/w40/${lc}.png 2x`}
                width={20}
                height={15}
                alt={name}
              />
            )}
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
      const currency = column.currency || 'USD'
      if (Number.isNaN(num)) {
        const text = String(value)
        return { content: text, order: text, search: text }
      }
      let formatted: string
      try {
        formatted = intl.formatNumber(num, { style: 'currency', currency })
      } catch {
        // Invalid ISO 4217 code — fall back to plain number formatting.
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
      if (isEmpty) return { content: '' }
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

// Column types that get a dropdown filter (values are discrete/enumerable).
const DROPDOWN_TYPES = new Set(['badge', 'tag', 'boolean'])

const DataTable = ({ src, columns = [] }: DataTableProps) => {
  const intl = useIntl()
  const table = useDataTable(src)
  const rows = table?.rows ?? []
  const cols = useMemo(() => columns, [columns])
  const tableRef = useRef<HTMLTableElement>(null)
  const instanceRef = useRef<DataTablesInstance | null>(null)
  const searchIconRootRef = useRef<Root | null>(null)

  const columnsKey = useMemo(() => JSON.stringify(cols), [cols])

  const anyFilterable = useMemo(() => cols.some((c) => c.filterable), [cols])

  const dropdownCols = useMemo(
    () => cols.filter((c) => c.filterable && DROPDOWN_TYPES.has(c.type ?? '')),
    [cols]
  )

  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>(
    {}
  )

  // Reset filter state when the table source or columns change.
  useEffect(() => {
    setColumnFilters({})
  }, [src, columnsKey])

  // Unique sorted values per dropdown column, derived from row data.
  const dropdownOptions = useMemo(() => {
    const result: Record<string, { value: string; content: string }[]> = {}
    for (const col of dropdownCols) {
      if (col.type === 'boolean') {
        result[col.key] = [
          { value: 'true', content: '✅ Yes' },
          { value: 'false', content: '❌ No' },
        ]
      } else {
        const unique = [
          ...new Set(
            rows
              .map((r) => r[col.key])
              .filter((v) => v != null && v !== '')
              .map(String)
          ),
        ].sort()
        result[col.key] = unique.map((v) => ({ value: v, content: v }))
      }
    }
    return result
  }, [dropdownCols, rows])

  const language = useMemo(
    () => ({
      lengthMenu: intl.formatMessage({ id: 'datatable.lengthMenu' }),
      search: '',
      searchPlaceholder: intl.formatMessage({
        id: 'datatable.searchPlaceholder',
      }),
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
    // Destroy any previous instance before deciding whether to re-init.
    if (instanceRef.current && tableRef.current?.isConnected) {
      try {
        instanceRef.current.destroy()
      } catch {
        // ignore
      }
    }
    instanceRef.current = null

    if (!tableRef.current || cols.length === 0) return

    let cancelled = false

    // Compute updatedAt label synchronously — stable for this src.
    const updatedAtDate = table?.updatedAt ? new Date(table.updatedAt) : null
    const updatedAtLabel =
      updatedAtDate && !Number.isNaN(updatedAtDate.getTime())
        ? `${intl.formatMessage({
            id: 'datatable.lastUpdated',
          })} ${intl.formatDate(updatedAtDate, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`
        : null

    const init = async () => {
      const DataTablesLib = await loadDataTables()
      if (cancelled || !tableRef.current) return

      const tableEl = tableRef.current

      let instance: DataTablesInstance | null = null
      try {
        instance = new DataTablesLib(tableEl, {
          language,
          searching: anyFilterable,
          ordering: true,
          paging: true,
          info: true,
          autoWidth: false,
          layout: {
            topStart: 'pageLength',
            topEnd: anyFilterable ? 'search' : null,
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
          drawCallback: updatedAtLabel
            ? function () {
                const infoEl = tableEl
                  .closest('.dt-container')
                  ?.querySelector('.dt-info')
                if (!infoEl) return
                let span = infoEl.querySelector('.dt-updated-at')
                if (!span) {
                  span = document.createElement('span')
                  span.className = 'dt-updated-at'
                  infoEl.appendChild(span)
                }
                span.textContent = ` · ${updatedAtLabel}`
              }
            : undefined,
        })
      } catch (error) {
        console.error('[DataTable] Error initializing DataTables:', error)
      }

      // If the component unmounted while we were awaiting, destroy immediately.
      if (cancelled) {
        if (instance && tableRef.current?.isConnected) {
          try {
            instance.destroy()
          } catch {
            // ignore
          }
        }
        return
      }

      instanceRef.current = instance

      // Mount SearchIcon into the DataTables-rendered search input.
      if (anyFilterable) {
        const searchInput = tableEl
          .closest('.dt-container')
          ?.querySelector('.dt-search input[type="search"]')
        if (searchInput) {
          const iconWrapper = document.createElement('span')
          iconWrapper.className = 'dt-search-icon'
          searchInput.parentElement?.insertBefore(iconWrapper, searchInput)
          const root = createRoot(iconWrapper)
          root.render(
            <SearchIcon
              sx={{
                width: '16px',
                minWidth: '16px',
                minHeight: '16px',
                flex: 0,
              }}
            />
          )
          searchIconRootRef.current = root
        }
      }
    }

    init()

    return () => {
      cancelled = true
      const instance = instanceRef.current
      instanceRef.current = null
      searchIconRootRef.current?.unmount()
      searchIconRootRef.current = null
      if (instance && tableRef.current?.isConnected) {
        try {
          instance.destroy()
        } catch {
          // DataTables DOM cleanup can race with React unmounting — safe to ignore
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

  return (
    <Box sx={styles.container}>
      {dropdownCols.length > 0 && (
        <Box sx={styles.filterBar}>
          {dropdownCols.map((col) => {
            const colIndex = cols.indexOf(col)
            return (
              <MultiSelect
                key={col.key}
                label={col.label ?? humanize(col.key)}
                options={dropdownOptions[col.key] ?? []}
                selected={columnFilters[col.key] ?? []}
                allLabel={intl.formatMessage({ id: 'datatable.filterAll' })}
                onChange={(vals) => {
                  setColumnFilters((prev) => ({ ...prev, [col.key]: vals }))
                  const regex =
                    vals.length > 0
                      ? `^(${vals
                          .map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                          .join('|')})$`
                      : ''
                  instanceRef.current
                    ?.column(colIndex)
                    .search(regex, { regex: true })
                    .draw()
                }}
              />
            )
          })}
          {Object.values(columnFilters).some((v) => v.length > 0) && (
            <button
              type="button"
              style={styles.clearFilters as React.CSSProperties}
              onClick={() => {
                setColumnFilters({})
                dropdownCols.forEach((col) => {
                  const colIndex = cols.indexOf(col)
                  instanceRef.current
                    ?.column(colIndex)
                    .search('', { regex: false })
                    .draw()
                })
              }}
            >
              {intl.formatMessage({ id: 'datatable.clearFilters' })}
            </button>
          )}
        </Box>
      )}
      <table ref={tableRef} className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            {cols.map((column) => (
              <th key={column.key}>{column.label ?? humanize(column.key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const key =
              typeof row.id === 'string' || typeof row.id === 'number'
                ? row.id
                : rowIndex
            return (
              <tr key={key}>
                {cols.map((column) => {
                  const cell = getCellData(column, row, intl)
                  return (
                    <td
                      key={column.key}
                      data-order={cell.order}
                      data-search={cell.search}
                      style={{
                        textAlign: cell.align || 'left',
                        ...(cell.noWrap
                          ? { whiteSpace: 'nowrap' as const }
                          : {}),
                      }}
                    >
                      {cell.content}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}

export default DataTable
