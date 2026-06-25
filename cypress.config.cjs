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
    // Spec ordering (T-45): the workflow pre-warm step warms every statically-known route to
    // HTTP 200 before Cypress starts, so no spec runs against a cold preview. search-doctype-filter
    // (historically the heaviest/coldest spec, ~6-min cold render) is still listed first so it runs
    // immediately after the pre-warm while the preview is warmest. The catch-all glob then runs the
    // remaining specs in alphabetical order; Cypress deduplicates, so doctype-filter runs once.
    // Combined with serial execution (single worker — the CI action sets no parallel/record/group)
    // and the after:spec inter-spec settle in plugins/index.js, this keeps concurrent origin
    // pressure low and avoids front-loading a cold-render spec ahead of the warmed preview.
    specPattern: [
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
