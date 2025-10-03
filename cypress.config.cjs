const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  fixturesFolder: 'src/tests/cypress/fixtures',
  downloadsFolder: 'src/tests/cypress/downloads',
  chromeWebSecurity: false,
  numTestsKeptInMemory: 10,
  experimentalMemoryManagement: true,
  e2e: {
    setupNodeEvents(on, config) {
      const plugins = require('./src/tests/cypress/plugins/index.js')
      return plugins(on, config)
    },
    specPattern: 'src/tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/tests/cypress/support/index.js',
    baseUrl: 'http://localhost:3030',
    pageLoadTimeout: 120000, // Increase timeout to 120 seconds for Netlify preview
  },
})
