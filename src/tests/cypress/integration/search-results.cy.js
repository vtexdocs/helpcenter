/// <reference types="cypress" />

describe('Search results page', () => {
  beforeEach(() => {
    cy.viewport(1366, 768)
  })

  context('query submission', () => {
    it('submits via Enter and renders a result list', () => {
      cy.visitWithRetry('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('orders')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })

    it('search URL includes the submitted keyword', () => {
      cy.visitWithRetry('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('orders')
      cy.url().should('include', 'keyword=orders')
    })
  })

  context('result cards', () => {
    it('each visible result card has a non-empty title', () => {
      cy.visitWithRetry('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('orders')
      // SearchCard uses Link legacyBehavior wrapping a Flex (not an <a>), so
      // href is not queryable via closest('a') — title text is the stable assertion
      cy.get('.searchCardTitle').each(($el) => {
        cy.wrap($el).invoke('text').should('not.be.empty')
      })
    })
  })

  context('empty state', () => {
    it('shows no result cards for a query with no results', () => {
      cy.intercept(/algolia\.net|\/api\/search/).as('searchRequest')
      cy.visitWithRetry('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('xyzzy-no-results-8f3k2')
      cy.wait('@searchRequest')
      cy.get('.searchCardTitle').should('not.exist')
    })
  })
})
