/// <reference types="cypress" />

describe('Search locale handling', () => {
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/', { timeout: 60000 })
  })

  const LOCALES = ['en', 'pt', 'es']

  // Use inner pages so the locale slug appears in the URL path (e.g. /pt/docs/tutorials).
  // cy.switchLocale from '/' gives URL '/pt' (no trailing slash), which breaks its
  // own include('/pt/') assertion. Visiting a locale doc page directly avoids this.
  const LOCALE_START_PATHS = {
    en: '/docs/tutorials',
    pt: '/pt/docs/tutorials',
    es: '/es/docs/tutorials',
  }

  LOCALES.forEach((locale) => {
    it(`returns search results when submitting from locale ${locale}`, () => {
      cy.visit(LOCALE_START_PATHS[locale], { timeout: 60000 })
      cy.submitSearch('orders')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })
  })
})
