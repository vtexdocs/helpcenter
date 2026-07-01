import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  width: '100%',
  overflowX: 'auto',
  marginBlock: '1em',

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
    alignItems: 'center !important',
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

  // `code` column type
  '& code.dt-code': {
    fontFamily: 'Consolas, monaco, monospace !important',
    fontSize: '0.85em',
    backgroundColor: '#f1f3f4',
    color: '#2d3748',
    padding: '0.15em 0.4em',
    borderRadius: '4px',
  },

  // `country` column type
  '& .dt-country': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6em',
    paddingRight: '18px',
  },

  // Page length select (bottom-left)
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

  // Info text (bottom row)
  '& .dt-info': {
    fontSize: '0.875rem !important',
    color: '#718096 !important',
    padding: '0.5rem 0 !important',
    textAlign: 'left !important',
  },
  '& .dt-updated-at': {
    color: '#718096',
  },

  // Pagination
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

const filterBarWrapper: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '0.5rem',
}

const filterBar: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
}

const filterBarExpanded: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  paddingTop: '0.5rem',
  borderTop: '1px solid #E7E9EE',
}

const filterBarLeft: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
}

const filterBarRight: SxStyleProp = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexShrink: 0,
  backgroundColor: '#F4F4F4',
  border: '1px solid #E7E9EE',
  borderRadius: '4px',
  padding: '0.5rem 0.75rem',
  '&:focus-within': {
    borderColor: '#a1a8b3',
  },
}

const searchInput = {
  width: '220px',
  fontSize: '0.875rem',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  color: '#2d3748',
}

const moreFilters = {
  backgroundColor: '#F4F4F4',
  border: '1px solid #E7E9EE',
  borderRadius: '4px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  color: '#4a4a4a',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
}

const clearFilters = {
  background: 'none',
  border: 'none',
  padding: '0.5rem 0',
  fontSize: '0.875rem',
  color: '#e31c58',
  cursor: 'pointer',
  textDecoration: 'underline',
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
  filterBarWrapper,
  filterBar,
  filterBarExpanded,
  filterBarLeft,
  filterBarRight,
  searchInput,
  moreFilters,
  clearFilters,
  unavailable,
}
