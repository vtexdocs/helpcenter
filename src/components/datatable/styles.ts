import type { SxStyleProp } from '@vtex/brand-ui'

const container: SxStyleProp = {
  width: '100%',
  overflowX: 'auto',
  marginBlock: '1em',
  '& table.dataTable': {
    width: '100% !important',
    margin: '0 !important',
    tableLayout: 'fixed' as SxStyleProp['tableLayout'],
  },
  '& table.dataTable thead th': {
    padding: '10px 18px !important',
  },
  '& table.dataTable tbody td': {
    padding: '10px 18px !important',
    wordWrap: 'break-word' as SxStyleProp['wordWrap'],
  },

  // Search input
  '& .dt-search label': {
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
  },
  '& .dt-search input[type="search"]': {
    padding: '0.5rem 0.75rem !important',
    fontSize: '0.875rem !important',
    border: '1px solid #e2e8f0 !important',
    borderRadius: '0.375rem !important',
    outline: 'none !important',
    transition: 'border-color 0.2s !important',
    marginLeft: '0.5rem !important',
    '&:focus': {
      borderColor: '#e31c58 !important',
      boxShadow: '0 0 0 3px rgba(227, 28, 88, 0.1) !important',
    },
  },

  // Page length select
  '& .dt-length label': {
    fontSize: '0.875rem !important',
    fontWeight: '500 !important',
  },
  '& .dt-length select': {
    padding: '0.5rem 2rem 0.5rem 0.75rem !important',
    fontSize: '0.875rem !important',
    border: '1px solid #e2e8f0 !important',
    borderRadius: '0.375rem !important',
    outline: 'none !important',
    backgroundColor: 'white !important',
    cursor: 'pointer !important',
    transition: 'border-color 0.2s !important',
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
    '&:focus': {
      borderColor: '#e31c58 !important',
      boxShadow: '0 0 0 3px rgba(227, 28, 88, 0.1) !important',
    },
    '&:hover': {
      borderColor: '#cbd5e0 !important',
    },
  },

  // Info text
  '& .dt-info': {
    fontSize: '0.875rem !important',
    color: '#718096 !important',
    padding: '0.5rem 0 !important',
  },

  // Pagination
  '& .dt-paging': {
    gap: '0.5rem !important',
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
      backgroundColor: '#e31c58 !important',
      borderColor: '#e31c58 !important',
      color: 'white !important',
      '&:hover': {
        backgroundColor: '#c41849 !important',
      },
    },
  },
}

export default {
  container,
}
