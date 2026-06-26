/// <reference types="cypress" />

describe('Search — Algolia regression (hybrid search flag OFF)', () => {
  before(() => {
    cy.request({
      url: '/docs/tutorials/about-the-admin-category',
      timeout: 90000,
      failOnStatusCode: false,
    })
  })

  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visitWithRetry('/docs/tutorials/about-the-admin-category')
  })

  it('search input is present and accepts text', () => {
    cy.get('[data-cy="search"]').first().parent().should('be.visible')
    cy.searchFor('orders')
    cy.get('[data-cy="search"]').first().should('have.value', 'orders')
  })

  it('autocomplete dropdown appears after typing', () => {
    cy.searchFor('orders')
    cy.getAutocompleteSuggestions().should('have.length.greaterThan', 0)
  })

  it('submitting a query navigates to a results URL', () => {
    cy.submitSearch('orders')
    cy.url().should('include', '/search')
  })

  it('at least one result card is visible', () => {
    cy.submitSearch('orders')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })

  it('no console errors mentioning hybrid-search endpoints', () => {
    cy.visitWithRetry('/docs/tutorials/about-the-admin-category', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      },
    })
    cy.submitSearch('orders')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    cy.get('@consoleError').then((spy) => {
      const calls = spy.args.flat().join(' ')
      expect(calls).not.to.include('hybrid')
    })
  })
})
