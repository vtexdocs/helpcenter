// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './events'

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Suspense boundary') ||
    err.message.includes('hydrating') ||
    err.message.includes('Minified React error') ||
    err.message.includes('invariant')
  ) {
    return false
  }
  return true
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
