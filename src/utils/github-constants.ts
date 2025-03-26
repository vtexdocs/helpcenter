/**
 * Centralized GitHub and retry-related constants
 * This file provides a single source of truth for configuration values
 * used across GitHub utilities and retry mechanisms.
 */
export const GITHUB_CONSTANTS = {
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30s timeout for GitHub operations
  MAX_RATE_LIMIT_WAIT: 60000, // 1 minute maximum wait time for rate limits

  // Retry configuration
  MAX_RETRIES: 8,
  DEFAULT_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 30000,
  BACKOFF_FACTOR: 2,

  // Default timeout for overall operations (5 minutes)
  DEFAULT_OPERATION_TIMEOUT: 300000,

  // Request headers for web scraping to appear as a real browser
  WEB_SCRAPING_HEADERS: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  },

  // Headers for raw GitHub content requests
  RAW_GITHUB_HEADERS: {
    'User-Agent': 'VTEX Documentation Bot',
  },
}
