/// <reference types="cypress" />

describe('Search results page', () => {
  before(() => {
    cy.request({
      url: '/docs/tutorials/about-the-admin-category',
      timeout: 90000,
      failOnStatusCode: false,
    })
  })

  beforeEach(() => {
    cy.viewport(1366, 768)
  })

  context('query submission', () => {
    it('submits via Enter and renders a result list', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('orders')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })

    it('search URL includes the submitted keyword', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('orders')
      cy.url().should('include', 'keyword=orders')
    })
  })

  context('result cards', () => {
    it('each visible result card has a non-empty title', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')
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
      cy.intercept(/algolia\.net|\/api\/search/).as('algoliaSearch')
      cy.visit('/docs/tutorials/about-the-admin-category')
      cy.submitSearch('xyzzy-no-results-8f3k2')
      cy.wait('@algoliaSearch')
      cy.get('.searchCardTitle').should('not.exist')
    })
  })
})
