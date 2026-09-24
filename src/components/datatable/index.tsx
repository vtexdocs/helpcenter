import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import type { IntlShape } from 'react-intl'
import { Tag, SearchIcon } from '@vtexdocs/components'
import type { TagColor } from '@vtexdocs/components'

import { useDataTable } from './context'
import type { DataTableColumn, DataTableRow } from './datatable.types'
import MultiSelect from 'components/multi-select'
import DateFilter, { emptyDateFilter } from 'components/date-filter'
import type { DateFilterValue } from 'components/date-filter'
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
const DROPDOWN_TYPES = new Set(['badge', 'tag', 'boolean', 'country'])

const buildDateSearch = (
  val: DateFilterValue,
  intl: IntlShape
): { pattern: string; regex: boolean } => {
  const { year, month, day } = val
  if (!year && !month && !day) return { pattern: '', regex: false }

  const monthShort = month
    ? intl.formatDate(new Date(2000, Number(month) - 1, 1), { month: 'short' })
    : null

  if (year && month && day) {
    const formatted = intl.formatDate(
      new Date(Number(year), Number(month) - 1, Number(day)),
      { day: 'numeric', month: 'short', year: 'numeric' }
    )
    return { pattern: formatted, regex: false }
  }
  if (year && month)
    return { pattern: `${monthShort} \\d+, ${year}`, regex: true }
  if (year && day) return { pattern: `\\w+ ${day}, ${year}`, regex: true }
  if (month && day)
    return { pattern: `${monthShort} ${day}, \\d{4}`, regex: true }
  if (year) return { pattern: year, regex: false }
  if (month) return { pattern: `${monthShort} \\d+, \\d{4}`, regex: true }
  // day only — match " N," to avoid false positives on years
  return { pattern: ` ${day},`, regex: false }
}
// Column types that get a date picker filter.
const DATE_FILTER_TYPES = new Set(['date'])

const MAX_VISIBLE_FILTERS = 2

const DataTable = ({ src, columns = [] }: DataTableProps) => {
  const intl = useIntl()
  const table = useDataTable(src)
  const rows = table?.rows ?? []
  const cols = useMemo(() => columns, [columns])
  const tableRef = useRef<HTMLTableElement>(null)
  const instanceRef = useRef<DataTablesInstance | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const columnsKey = useMemo(() => JSON.stringify(cols), [cols])

  const colIndexMap = useMemo(
    () => new Map(cols.map((col, i) => [col, i])),
    [cols]
  )

  const dropdownCols = useMemo(
    () => cols.filter((c) => c.filterable && DROPDOWN_TYPES.has(c.type ?? '')),
    [cols]
  )

  const dateCols = useMemo(
    () =>
      cols.filter((c) => c.filterable && DATE_FILTER_TYPES.has(c.type ?? '')),
    [cols]
  )

  // All columns that get a filter control, in column order.
  const allFilterCols = useMemo(
    () =>
      cols.filter(
        (c) =>
          c.filterable &&
          (DROPDOWN_TYPES.has(c.type ?? '') ||
            DATE_FILTER_TYPES.has(c.type ?? ''))
      ),
    [cols]
  )

  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>(
    {}
  )
  const [dateFilters, setDateFilters] = useState<
    Record<string, DateFilterValue>
  >({})
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  const hasActiveFilters =
    Object.values(columnFilters).some((v) => v.length > 0) ||
    Object.values(dateFilters).some(
      ({ year, month, day }) => year || month || day
    )

  // Single pass over rows: collect year options (date cols) and dropdown options (dropdown cols).
  const { dateYearOptions, dropdownOptions } = useMemo(() => {
    const regionNames = getRegionNames(intl.locale)
    const yearSets: Record<string, Set<string>> = {}
    const valueSets: Record<string, Set<string>> = {}

    for (const col of dateCols) yearSets[col.key] = new Set()
    for (const col of dropdownCols) {
      if (col.type !== 'boolean') valueSets[col.key] = new Set()
    }

    for (const row of rows) {
      for (const col of dateCols) {
        const v = row[col.key]
        if (v == null || v === '') continue
        const y = new Date(v as string).getFullYear()
        if (!Number.isNaN(y)) yearSets[col.key].add(String(y))
      }
      for (const col of dropdownCols) {
        if (col.type === 'boolean') continue
        const v = row[col.key]
        if (v == null || v === '') continue
        valueSets[col.key].add(
          col.type === 'country' ? String(v).trim().toUpperCase() : String(v)
        )
      }
    }

    const dateYears: Record<string, string[]> = {}
    for (const col of dateCols) {
      dateYears[col.key] = [...yearSets[col.key]].sort()
    }

    const dropdowns: Record<string, { value: string; content: string }[]> = {}
    for (const col of dropdownCols) {
      if (col.type === 'boolean') {
        dropdowns[col.key] = [
          { value: 'true', content: '✅ Yes' },
          { value: 'false', content: '❌ No' },
        ]
      } else if (col.type === 'country') {
        const codes = [...valueSets[col.key]].sort((a, b) =>
          (regionNames.of(a) ?? a).localeCompare(regionNames.of(b) ?? b)
        )
        dropdowns[col.key] = codes.map((code) => ({
          value: code,
          content: regionNames.of(code) ?? code,
        }))
      } else {
        const vals = [...valueSets[col.key]].sort()
        dropdowns[col.key] = vals.map((v) => ({ value: v, content: v }))
      }
    }

    return { dateYearOptions: dateYears, dropdownOptions: dropdowns }
  }, [allFilterCols, rows, intl.locale, dateCols, dropdownCols])

  // Reset all filters and search when source or columns change.
  useEffect(() => {
    setColumnFilters({})
    setDateFilters({})
    setSearchQuery('')
    setShowMoreFilters(false)
  }, [src, columnsKey])

  const language = useMemo(
    () => ({
      lengthMenu: intl.formatMessage({ id: 'datatable.lengthMenu' }),
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
          searching: true,
          ordering: true,
          paging: true,
          info: true,
          autoWidth: false,
          layout: {
            topStart: null,
            topEnd: null,
            bottomStart: 'pageLength',
            bottomEnd: 'paging',
            bottom2Start: 'info',
            bottom2End: null,
          },
          columnDefs: cols.map((column, index) => ({
            targets: index,
            orderable: Boolean(column.sortable),
            searchable: true,
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
    }

    init()

    const tableEl = tableRef.current
    return () => {
      cancelled = true
      const instance = instanceRef.current
      instanceRef.current = null
      if (instance && tableEl?.isConnected) {
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

  const renderFilterControl = (col: DataTableColumn) => {
    const colIndex = colIndexMap.get(col) ?? -1
    if (DATE_FILTER_TYPES.has(col.type ?? '')) {
      return (
        <DateFilter
          key={col.key}
          label={col.label ?? humanize(col.key)}
          value={dateFilters[col.key] ?? emptyDateFilter}
          yearOptions={dateYearOptions[col.key] ?? []}
          onChange={(val) => {
            setDateFilters((prev) => ({ ...prev, [col.key]: val }))
            const { pattern, regex } = buildDateSearch(val, intl)
            instanceRef.current
              ?.column(colIndex)
              .search(pattern, { regex })
              .draw()
          }}
        />
      )
    }
    return (
      <MultiSelect
        key={col.key}
        label={col.label ?? humanize(col.key)}
        options={dropdownOptions[col.key] ?? []}
        selected={columnFilters[col.key] ?? []}
        allLabel={intl.formatMessage({ id: 'datatable.filterAll' })}
        onChange={(vals) => {
          setColumnFilters((prev) => ({ ...prev, [col.key]: vals }))
          const escaped = vals.map((v) =>
            v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          )
          const pattern = escaped.length > 0 ? escaped.join('|') : ''
          // country: match alpha-2 code at word boundary in "Name CODE" data-search
          // others: exact anchored match on the cell value
          const searchRegex =
            col.type === 'country'
              ? pattern
                ? `\\b(${pattern})\\b`
                : ''
              : pattern
              ? `^(${pattern})$`
              : ''
          instanceRef.current
            ?.column(colIndex)
            .search(searchRegex, { regex: pattern.length > 0 })
            .draw()
        }}
      />
    )
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.filterBarWrapper}>
        {/* Row 1: visible filters + toggle + search (when not expanded) */}
        <Box sx={styles.filterBar}>
          {allFilterCols
            .slice(0, MAX_VISIBLE_FILTERS)
            .map((col) => renderFilterControl(col))}
          {allFilterCols.length > MAX_VISIBLE_FILTERS && (
            <button
              type="button"
              title={
                showMoreFilters
                  ? intl.formatMessage({ id: 'datatable.lessFilters' })
                  : intl.formatMessage({ id: 'datatable.moreFilters' })
              }
              style={styles.moreFiltersIcon as React.CSSProperties}
              onClick={() => setShowMoreFilters((v) => !v)}
            >
              {showMoreFilters ? '−' : '+'}
            </button>
          )}
          <button
            type="button"
            style={{
              ...(styles.clearFilters as React.CSSProperties),
              visibility: hasActiveFilters ? 'visible' : 'hidden',
              flexShrink: 0,
            }}
            onClick={() => {
              setColumnFilters({})
              setDateFilters(
                Object.fromEntries(
                  dateCols.map((c) => [c.key, emptyDateFilter])
                )
              )
              allFilterCols.forEach((col) => {
                const colIndex = colIndexMap.get(col) ?? -1
                instanceRef.current
                  ?.column(colIndex)
                  .search('', { regex: false })
                  .draw()
              })
            }}
          >
            {intl.formatMessage({ id: 'datatable.clearFilters' })}
          </button>
          <Box sx={styles.filterBarRight}>
            <SearchIcon
              sx={{
                width: '16px',
                minWidth: '16px',
                minHeight: '16px',
                flex: 0,
                color: '#747474',
              }}
            />
            <input
              type="search"
              value={searchQuery}
              placeholder={intl.formatMessage({
                id: 'datatable.searchPlaceholder',
              })}
              onChange={(e) => {
                const val = e.currentTarget.value
                setSearchQuery(val)
                instanceRef.current?.search(val).draw()
              }}
              style={styles.searchInput as React.CSSProperties}
            />
          </Box>
        </Box>

        {/* Row 2: expanded filters + clear + search */}
        {showMoreFilters && (
          <Box sx={styles.filterBarExpanded}>
            <Box sx={styles.filterBarLeft}>
              {allFilterCols
                .slice(MAX_VISIBLE_FILTERS)
                .map((col) => renderFilterControl(col))}
            </Box>
          </Box>
        )}
      </Box>
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
