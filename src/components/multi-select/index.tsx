import { useEffect, useRef, useState } from 'react'

interface Option {
  value: string
  content: string
}

interface Props {
  label: string
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  allLabel?: string
}

const MultiSelect = ({
  label,
  options,
  selected,
  onChange,
  allLabel = 'All',
}: Props) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [])

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(next)
  }

  const triggerLabel =
    selected.length === 0
      ? allLabel
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.content ?? selected[0]
      : `${selected.length} selected`

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
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
            outline: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{triggerLabel}</span>
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
              minWidth: '160px',
              maxHeight: '240px',
              overflowY: 'auto',
            }}
          >
            {options.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: selected.includes(opt.value)
                    ? '#F4F4F4'
                    : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  style={{ accentColor: '#e31c58', cursor: 'pointer' }}
                />
                {opt.content}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelect
