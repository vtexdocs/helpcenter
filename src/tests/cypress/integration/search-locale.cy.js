/// <reference types="cypress" />

describe('Search locale handling', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
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
    cy.viewport(1366, 768)
    cy.visit('/', { timeout: 30000 })
  })

  const LOCALES = ['en', 'pt', 'es']

  LOCALES.forEach((locale) => {
    it(`shows results and reflects locale ${locale} in the URL`, () => {
      cy.switchLocale(locale)
      cy.submitSearch('orders')
      cy.verifyLocale(locale)
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })
  })
})
