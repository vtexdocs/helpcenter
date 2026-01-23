const { defineConfig } = require('cypress')

module.exports = defineConfig({
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
    specPattern: 'src/tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/tests/cypress/support/index.js',
    baseUrl: 'http://localhost:3030',
    // Increased timeouts for CI/Netlify preview environments which can be slow
    pageLoadTimeout: 60000, // 60 seconds for page loads (reduced from 180s)
    defaultCommandTimeout: 10000, // 10 seconds for element assertions (reduced from 20s)
    requestTimeout: 60000, // 60 seconds for cy.request()
    responseTimeout: 60000, // 60 seconds for responses
    retries: {
      runMode: 1, // Retry failed tests once in CI (reduced from 2)
      openMode: 0, // No retries in interactive mode
    },
  },
})
