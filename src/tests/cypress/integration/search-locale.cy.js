/// <reference types="cypress" />

describe('Search locale handling', () => {
  before(() => {
    const warmUp = (url, attempt = 0) => {
      cy.request({ url, failOnStatusCode: false, timeout: 30000 }).then(
        (resp) => {
          if (resp.status !== 200 && attempt < 10)
            cy.wait(2000).then(() => warmUp(url, attempt + 1))
        }
      )
    }
    warmUp('/pt/docs/tutorials')
    warmUp('/es/docs/tutorials')
  })

  beforeEach(() => {
    cy.viewport(1366, 768)
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
      cy.visitWithRetry(LOCALE_START_PATHS[locale])
      cy.submitSearch('orders')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })
  })
})
