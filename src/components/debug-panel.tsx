import React, { useState } from 'react'

interface DebugPanelProps {
  title?: string
  error?: string
  errorInfo?: unknown
  data?: unknown
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  title = 'Debug Information',
  error,
  errorInfo,
  data,
}) => {
  const [expanded, setExpanded] = useState(false)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      style={{
        background: '#ffeeee',
        padding: '15px',
        border: '1px solid #ff0000',
        margin: '15px 0',
        borderRadius: '4px',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      {expanded && (
        <>
          {errorInfo && (
            <div>
              <h4>Error Details:</h4>
              <pre
                style={{
                  background: '#fff',
                  padding: '10px',
                  border: '1px solid #ddd',
                  overflowX: 'auto',
                }}
              >
                {typeof errorInfo === 'string'
                  ? errorInfo
                  : JSON.stringify(errorInfo, null, 2)}
              </pre>
            </div>
          )}

          {data && (
            <div>
              <h4>Data:</h4>
              <pre
                style={{
                  background: '#fff',
                  padding: '10px',
                  border: '1px solid #ddd',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DebugPanel
