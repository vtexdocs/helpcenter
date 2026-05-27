/// <reference types="cypress" />

describe('Search — Algolia regression (hybrid search flag OFF)', () => {
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
    cy.visit('/')
  })

  it('search input is present and accepts text', () => {
    cy.get('[data-cy="search"]').parent().should('be.visible')
    cy.searchFor('orders')
    cy.get('[data-cy="search"]').should('have.value', 'orders')
  })

  it('autocomplete dropdown appears after typing', () => {
    cy.searchFor('orders')
    cy.get('[data-cy="search"]')
      .parent()
      .parent()
      .find('a')
      .should('have.length.greaterThan', 0)
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
    cy.on('window:console', (type, ...args) => {
      if (type === 'error') {
        expect(args.join(' ')).not.to.include('hybrid')
      }
    })
    cy.submitSearch('orders')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })
})
