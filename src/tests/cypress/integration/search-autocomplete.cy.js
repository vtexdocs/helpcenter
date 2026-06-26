/// <reference types="cypress" />

describe('Search autocomplete', () => {
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/docs/tutorials/about-the-admin-category')
  })

  it('shows dropdown suggestions after typing a query', () => {
    cy.searchFor('orders')
    cy.getAutocompleteSuggestions().should('have.length.greaterThan', 0)
  })

  it('navigates to a result when a suggestion is clicked', () => {
    cy.url().then((startUrl) => {
      cy.searchFor('orders')
      cy.getAutocompleteSuggestions().first().click()
      cy.url().should('not.eq', startUrl)
    })
  })

  it('closes the dropdown when clicking outside the search component', () => {
    cy.searchFor('orders')
    cy.getAutocompleteSuggestions().should('have.length.greaterThan', 0)
    // mousedown outside the search Box triggers the useClickOutside handler,
    // setting focusOut.modaltoggle=false and removing the dropdown from the DOM
    cy.get('body').click(0, 400)
    cy.getAutocompleteSuggestions().should('not.exist')
  })

  it('dropdown suggestion links have valid hrefs', () => {
    // autocomplete items render as real <a> tags (Link legacyBehavior wrapping <a>)
    // — confirm the first suggestion carries a non-empty href
    cy.searchFor('orders')
    cy.getAutocompleteSuggestions()
      .first()
      .invoke('attr', 'href')
      .should('not.be.empty')
  })
})
