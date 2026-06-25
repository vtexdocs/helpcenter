const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    HYBRID_SEARCH_ENABLED: process.env.CYPRESS_HYBRID_SEARCH_ENABLED ?? 'true',
  },
  video: false, // Disabled by default for speed; enable via CLI --config video=true if needed
  screenshotOnRunFailure: true,
  videosFolder: 'src/tests/cypress/videos',
  screenshotsFolder: 'src/tests/cypress/screenshots',
  fixturesFolder: 'src/tests/cypress/fixtures',
  downloadsFolder: 'src/tests/cypress/downloads',
  chromeWebSecurity: false,
  numTestsKeptInMemory: 10,
  experimentalMemoryManagement: true,
  // Custom User-Agent to bypass bot detection middleware
  // The middleware uses isbot library which would redirect Cypress requests to LLM content API
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CypressTest/1.0',
  e2e: {
    setupNodeEvents(on, config) {
      const plugins = require('./src/tests/cypress/plugins/index.js')
      return plugins(on, config)
    },
    specPattern: [
      // Run doctype-filter first so it executes while the Netlify preview is warmest.
      // The catch-all glob below picks it up too; Cypress deduplicates, so it only runs once.
      'src/tests/cypress/integration/search-doctype-filter.cy.js',
      'src/tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    ],
    supportFile: 'src/tests/cypress/support/index.js',
    baseUrl: 'http://localhost:3030',
    // Shorter timeouts with more retries - fail fast, retry often
    pageLoadTimeout: 120000, // 120 seconds for page loads (Netlify ISR cold renders can exceed 60s)
    defaultCommandTimeout: 5000, // 5 seconds for element assertions
    requestTimeout: 10000, // 10 seconds for cy.request()
    responseTimeout: 10000, // 10 seconds for responses
    retries: {
      runMode: 2, // CI: retry a failing test up to 2 times before reporting failure
      openMode: 0, // local interactive runner: no retries (fail fast for dev feedback)
    },
  },
})
