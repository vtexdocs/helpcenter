type LogLevel = 'debug' | 'info' | 'warn' | 'error'
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const DEFAULT_LOG_LEVEL = 'warn'

let currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || DEFAULT_LOG_LEVEL

export const setLogLevel = (level: LogLevel) => {
  currentLogLevel = level
}

export const getLogger = (name: string) => {
  const shouldLog = (level: LogLevel) =>
    LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel]

  return {
    info: (message: string) => {
      if (shouldLog('info')) {
        console.log(`[${name}] INFO: ${message}`)
      }
    },
    error: (message: string) => {
      if (shouldLog('error')) {
        console.error(`[${name}] ERROR: ${message}`)
      }
    },
    warn: (message: string) => {
      if (shouldLog('warn')) {
        console.warn(`[${name}] WARN: ${message}`)
      }
    },
    debug: (message: string) => {
      if (shouldLog('debug')) {
        console.debug(`[${name}] DEBUG: ${message}`)
      }
    },
  }
}
