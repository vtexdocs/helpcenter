/// <reference types="cypress" />

describe('Search results page', () => {
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
  })

  context('query submission', () => {
    it('submits via Enter and renders a result list', () => {
      cy.visit('/', { timeout: 60000 })
      cy.submitSearch('orders', 'enter')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })

    it('submits via search button and renders a result list', () => {
      cy.visit('/', { timeout: 60000 })
      cy.submitSearch('orders', 'button')
      cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
    })
  })

  context('result cards', () => {
    it('each visible result card has a non-empty title', () => {
      cy.visit('/', { timeout: 60000 })
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
      cy.intercept('POST', /algolia\.net/).as('algoliaSearch')
      cy.visit('/', { timeout: 60000 })
      cy.submitSearch('xyzzy-no-results-8f3k2')
      cy.wait('@algoliaSearch')
      cy.get('.searchCardTitle').should('not.exist')
    })
  })
})
