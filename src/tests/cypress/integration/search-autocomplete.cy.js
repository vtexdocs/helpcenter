/// <reference types="cypress" />

describe('Search autocomplete', () => {
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
    cy.visit('/', { timeout: 60000 })
  })

  it('shows dropdown suggestions after typing a query', () => {
    cy.searchFor('orders')
    cy.get('[data-cy="search"]')
      .first()
      .parent()
      .parent()
      .find('a')
      .should('have.length.greaterThan', 0)
  })

  it('navigates to a result when a suggestion is clicked', () => {
    cy.searchFor('orders')
    cy.get('[data-cy="search"]')
      .first()
      .parent()
      .parent()
      .find('a')
      .first()
      .click()
    cy.url().should('not.eq', Cypress.config('baseUrl') + '/')
  })

  it('closes the dropdown when clicking outside the search component', () => {
    cy.searchFor('orders')
    cy.get('[data-cy="search"]')
      .first()
      .parent()
      .parent()
      .find('a')
      .should('have.length.greaterThan', 0)
    // mousedown outside the search Box triggers the useClickOutside handler,
    // setting focusOut.modaltoggle=false and removing the dropdown from the DOM
    cy.get('body').click(0, 400)
    cy.get('[data-cy="search"]')
      .first()
      .parent()
      .parent()
      .find('a')
      .should('not.exist')
  })

  it('dropdown suggestion links have valid hrefs', () => {
    // autocomplete items render as real <a> tags (Link legacyBehavior wrapping <a>)
    // — confirm the first suggestion carries a non-empty href
    cy.searchFor('orders')
    cy.get('[data-cy="search"]')
      .first()
      .parent()
      .parent()
      .find('a')
      .first()
      .invoke('attr', 'href')
      .should('not.be.empty')
  })
})
