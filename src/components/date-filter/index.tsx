import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

export interface DateFilterValue {
  year: string
  month: string
  day: string
}

export const emptyDateFilter: DateFilterValue = { year: '', month: '', day: '' }

interface Props {
  label: string
  value: DateFilterValue
  yearOptions: string[]
  onChange: (value: DateFilterValue) => void
}

type View = 'year' | 'month' | 'day'

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const cellStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 4px',
  fontSize: '0.8125rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: active ? '#e31c58' : 'transparent',
  color: active ? '#fff' : '#2d3748',
  fontWeight: active ? 600 : 400,
  textAlign: 'center' as const,
  width: '100%',
})

const clearCellStyle: React.CSSProperties = {
  padding: '6px 8px',
  fontSize: '0.8125rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#F4F4F4',
  color: '#718096',
  textAlign: 'center' as const,
  marginBottom: '4px',
}

const backBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#e31c58',
  padding: '2px 4px',
}

const DateFilter = ({ label, value, yearOptions, onChange }: Props) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('year')
  const [navYear, setNavYear] = useState('')
  const [navMonth, setNavMonth] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleOpen = () => {
    if (value.year) {
      setNavYear(value.year)
      if (value.month) {
        setNavMonth(value.month)
        setView('day')
      } else {
        setView('month')
      }
    } else {
      setNavYear('')
      setNavMonth('')
      setView('year')
    }
    setOpen(true)
  }

  const triggerLabel = (() => {
    const { year, month, day } = value
    if (!year && !month && !day)
      return intl.formatMessage({ id: 'datatable.dateAny' })
    if (year && month && day)
      return intl.formatDate(
        new Date(Number(year), Number(month) - 1, Number(day)),
        { day: 'numeric', month: 'short', year: 'numeric' }
      )
    if (year && month)
      return intl.formatDate(new Date(Number(year), Number(month) - 1, 1), {
        month: 'long',
        year: 'numeric',
      })
    return year
  })()

  // Compute the longest possible trigger label so the button width stays stable.
  const longestLabel = (() => {
    const anyDate = intl.formatMessage({ id: 'datatable.dateAny' })
    if (yearOptions.length === 0) return anyDate
    const refYear = yearOptions[0]
    const candidates = [
      anyDate,
      refYear,
      // Longest month+year: try all 12 months, pick the longest formatted string
      ...MONTHS.map((m) =>
        intl.formatDate(new Date(Number(refYear), m - 1, 1), {
          month: 'long',
          year: 'numeric',
        })
      ),
      // Longest full date: use day 28 (safe for all months) with all months
      ...MONTHS.map((m) =>
        intl.formatDate(new Date(Number(refYear), m - 1, 28), {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      ),
    ]
    return candidates.reduce((a, b) => (a.length >= b.length ? a : b), '')
  })()

  const daysInMonth =
    navYear && navMonth
      ? new Date(Number(navYear), Number(navMonth), 0).getDate()
      : 31

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        minWidth: 0,
        maxWidth: '260px',
      }}
    >
      <span
        style={{
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : handleOpen())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #E7E9EE',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            maxWidth: '180px',
          }}
        >
          <span style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            {/* Ghost: invisible but holds the width of the longest label */}
            <span
              aria-hidden
              style={{ visibility: 'hidden', whiteSpace: 'nowrap' }}
            >
              {longestLabel}
            </span>
            {/* Real label overlaid on top, centered over the ghost */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
              }}
            >
              {triggerLabel}
            </span>
          </span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            style={{
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : undefined,
              transition: 'transform 0.15s',
            }}
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="#747474"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              backgroundColor: '#fff',
              border: '1px solid #E7E9EE',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: '200px',
              padding: '8px',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '0 4px',
              }}
            >
              <div>
                {view === 'year' && (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#4a4a4a',
                    }}
                  >
                    {intl.formatMessage({ id: 'datatable.dateSelectYear' })}
                  </span>
                )}
                {view === 'month' && (
                  <button
                    type="button"
                    style={backBtnStyle}
                    onClick={() => setView('year')}
                  >
                    ‹ {navYear}
                  </button>
                )}
                {view === 'day' && (
                  <button
                    type="button"
                    style={backBtnStyle}
                    onClick={() => setView('month')}
                  >
                    ‹{' '}
                    {intl.formatDate(
                      new Date(Number(navYear), Number(navMonth) - 1, 1),
                      { month: 'long', year: 'numeric' }
                    )}
                  </button>
                )}
              </div>
              {(value.year || value.month || value.day) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(emptyDateFilter)
                    setOpen(false)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    color: '#e31c58',
                    textDecoration: 'underline',
                    padding: '2px 4px',
                  }}
                >
                  {intl.formatMessage({ id: 'datatable.dateClear' })}
                </button>
              )}
            </div>

            {/* Clear row */}
            <div style={{ marginBottom: '4px' }}>
              {view === 'year' && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(emptyDateFilter)
                    setOpen(false)
                  }}
                  style={{ ...clearCellStyle, width: '100%' }}
                >
                  {intl.formatMessage({ id: 'datatable.dateAny' })}
                </button>
              )}
              {view === 'month' && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ year: navYear, month: '', day: '' })
                    setOpen(false)
                  }}
                  style={{ ...clearCellStyle, width: '100%' }}
                >
                  {intl.formatMessage({ id: 'datatable.dateClearMonth' })}
                </button>
              )}
              {view === 'day' && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ year: navYear, month: navMonth, day: '' })
                    setOpen(false)
                  }}
                  style={{ ...clearCellStyle, width: '100%' }}
                >
                  {intl.formatMessage({ id: 'datatable.dateClearDay' })}
                </button>
              )}
            </div>

            {/* Year grid */}
            {view === 'year' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                }}
              >
                {yearOptions.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      onChange({ year: y, month: '', day: '' })
                      setNavYear(y)
                      setView('month')
                    }}
                    style={cellStyle(value.year === y && !value.month)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {/* Month grid */}
            {view === 'month' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                }}
              >
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onChange({ year: navYear, month: String(m), day: '' })
                      setNavMonth(String(m))
                      setView('day')
                    }}
                    style={cellStyle(
                      value.year === navYear &&
                        value.month === String(m) &&
                        !value.day
                    )}
                  >
                    {intl.formatDate(new Date(2000, m - 1, 1), {
                      month: 'short',
                    })}
                  </button>
                ))}
              </div>
            )}

            {/* Day grid */}
            {view === 'day' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '4px',
                }}
              >
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        onChange({
                          year: navYear,
                          month: navMonth,
                          day: String(d),
                        })
                        setOpen(false)
                      }}
                      style={cellStyle(
                        value.year === navYear &&
                          value.month === navMonth &&
                          value.day === String(d)
                      )}
                    >
                      {d}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DateFilter
