/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-var-requires
const clipboardy = require('clipboardy')
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Pause between specs so the Netlify deploy preview's per-IP throttle window (B-5) decays
// before the next spec starts hitting the origin. Cypress already runs specs serially in a
// single process (no parallelism in CI), so this is the only remaining knob to lower
// sustained concurrent origin pressure across the run. Override with CYPRESS_INTER_SPEC_SETTLE_MS.
const INTER_SPEC_SETTLE_MS = Number(
  process.env.CYPRESS_INTER_SPEC_SETTLE_MS ?? 3000
)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function plugins(on, config) {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  if (INTER_SPEC_SETTLE_MS > 0) {
    on('after:spec', () => {
      return new Promise((resolve) => setTimeout(resolve, INTER_SPEC_SETTLE_MS))
    })
  }

  on('task', {
    setUrl: (url) => {
      global.url = url
      return null
    },
    getUrl: () => {
      return global.url
    },
    getClipboard: () => {
      return clipboardy.readSync()
    },
    log: (message) => {
      console.log(message)
      return null
    },
  })
}
