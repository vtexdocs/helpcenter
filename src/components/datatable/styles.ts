import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  width: '100%',
  overflowX: 'auto',
  marginBlock: '1em',

  // Make the DataTables wrapper and its control rows match the table width,
  // so the search (top) and the count/pagination (bottom) align to the
  // table's right edge.
  '& .dt-container': {
    width: '100% !important',
    minWidth: '100% !important',
    display: 'block !important',
  },
  '& .dt-layout-row': {
    width: '100% !important',
    minWidth: '100% !important',
    marginInline: '0 !important',
    display: 'flex !important',
    justifyContent: 'space-between !important',
  },

  '& table.dataTable': {
    width: '100% !important',
    minWidth: '100% !important',
    maxWidth: '100% !important',
    margin: '0 !important',
    tableLayout: 'auto' as SxStyleProp['tableLayout'],
  },
  '& table.dataTable colgroup col': {
    width: '1%',
  },
  '& table.dataTable thead th': {
    padding: '12px 18px !important',
    borderBottom: 'none !important',
    whiteSpace: 'normal',
  },
  '& table.dataTable tbody td': {
    padding: '12px 18px !important',
    wordWrap: 'break-word' as SxStyleProp['wordWrap'],
    whiteSpace: 'normal',
  },

  // `code` column type: inline code style
  '& code.dt-code': {
    fontFamily: 'Consolas, monaco, monospace !important',
    fontSize: '0.85em',
    backgroundColor: '#f1f3f4',
    color: '#2d3748',
    padding: '0.15em 0.4em',
    borderRadius: '4px',
  },

  // `country` column type: flag + name on one line
  '& .dt-country': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6em',
    paddingRight: '18px',
  },

  // Search input (Help Center style: light gray, rounded), fixed width and
  // anchored to the right edge of the table.
  '& .dt-search': {
    justifyContent: 'flex-end !important',
  },
  '& .dt-search label': {
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
  },
  '& .dt-search': {
    position: 'relative !important',
  },
  '& .dt-search-icon': {
    position: 'absolute',
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  '& .dt-search input[type="search"]': {
    width: '260px !important',
    maxWidth: '100% !important',
    padding: '0.5rem 0.75rem 0.5rem 2.25rem !important',
    fontSize: '0.875rem !important',
    lineHeight: '1.25 !important',
    backgroundColor: '#F4F4F4 !important',
    border: '1px solid #E7E9EE !important',
    borderRadius: '4px !important',
    outline: 'none !important',
    transition: 'border-color 0.2s !important',
    marginLeft: '0.5rem !important',
    '&:focus': {
      borderColor: '#a1a8b3 !important',
    },
  },

  // Page length select
  '& .dt-length': {
    width: 'auto !important',
    flex: '0 0 auto !important',
  },
  '& .dt-length label': {
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
  },
  '& .dt-length select': {
    width: '72px !important',
    padding: '0.5rem 1.75rem 0.5rem 0.5rem !important',
    fontSize: '0.875rem !important',
    border: '1px solid #e2e8f0 !important',
    borderRadius: '0.375rem !important',
    outline: 'none !important',
    backgroundColor: 'white !important',
    cursor: 'pointer !important',
    transition: 'border-color 0.2s !important',
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
    appearance: 'none !important',
    WebkitAppearance: 'none !important',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23747474' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important`,
    backgroundRepeat: 'no-repeat !important',
    backgroundPosition: 'right 0.5rem center !important',
    '&:hover': {
      borderColor: '#cbd5e0 !important',
    },
  },

  // Info / page count text (kept on the left)
  '& .dt-info': {
    fontSize: '0.875rem !important',
    color: '#718096 !important',
    padding: '0.5rem 0 !important',
    textAlign: 'left !important',
  },
  '& .dt-updated-at': {
    color: '#718096',
  },

  // Pagination (kept on the right)
  '& .dt-paging': {
    gap: '0.5rem !important',
    justifyContent: 'flex-end !important',
  },
  '& .dt-paging button': {
    padding: '0.5rem 0.75rem !important',
    fontSize: '0.875rem !important',
    border: '1px solid #e2e8f0 !important',
    borderRadius: '0.375rem !important',
    backgroundColor: 'white !important',
    color: '#2d3748 !important',
    cursor: 'pointer !important',
    transition: 'all 0.2s !important',
    fontWeight: '500 !important',
    minWidth: '2.5rem !important',
    '&:hover:not(:disabled)': {
      backgroundColor: '#f7fafc !important',
      borderColor: '#cbd5e0 !important',
    },
    '&:disabled': {
      opacity: '0.5 !important',
      cursor: 'not-allowed !important',
    },
    '&.current': {
      backgroundColor: '#e7e9ee !important',
      borderColor: '#e7e9ee !important',
      color: '#2d3748 !important',
      '&:hover': {
        backgroundColor: '#d3d6de !important',
      },
    },
  },
}

const filterBar: SxStyleProp = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '0.5rem',
  // Match Select dropdown height to the DataTables length/search controls.
  '& select': {
    height: 'auto !important',
    padding: '0.5rem 2rem 0.5rem 0.75rem !important',
    fontSize: '0.875rem !important',
  },
}

const clearFilters = {
  background: 'none',
  border: 'none',
  padding: '0.5rem 0',
  fontSize: '0.875rem',
  color: '#e31c58',
  cursor: 'pointer',
  textDecoration: 'underline',
  alignSelf: 'flex-end',
}

const unavailable: SxStyleProp = {
  marginBlock: '1em',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: '#4a3800',
  border: '1px solid #ffb100',
  borderRadius: '4px',
  backgroundColor: '#fff2d4',
}

export default {
  container,
  filterBar,
  clearFilters,
  unavailable,
}
