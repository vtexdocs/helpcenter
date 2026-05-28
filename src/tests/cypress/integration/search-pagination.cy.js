/// <reference types="cypress" />

describe('Search pagination / infinite scroll', () => {
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
    cy.submitSearch('api')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })

  it('loads more results when scrolled to the bottom', () => {
    cy.get('.searchCardTitle')
      .its('length')
      .then((firstPageCount) => {
        cy.scrollTo('bottom')
        // wait for the IntersectionObserver sentinel to trigger and Algolia to return the next page
        cy.wait(1500)
        cy.get('.searchCardTitle').should(
          'have.length.greaterThan',
          firstPageCount
        )
      })
  })

  it('scrolling loads new results not seen on the first page', () => {
    // SearchCard uses Link legacyBehavior wrapping a Flex (not an <a>), so
    // hrefs are not queryable — verify newness via title text instead
    cy.get('.searchCardTitle').then(($firstPage) => {
      const firstPageTitles = new Set(
        [...$firstPage].map((el) => el.textContent.trim())
      )
      cy.scrollTo('bottom')
      // wait for IntersectionObserver sentinel + Algolia to return next page
      cy.wait(1500)
      cy.get('.searchCardTitle').then(($allResults) => {
        const newTitles = [...$allResults]
          .map((el) => el.textContent.trim())
          .filter((t) => !firstPageTitles.has(t))
        expect(newTitles.length).to.be.greaterThan(0)
      })
    })
  })

  it('previously loaded results remain visible after scrolling back to the top', () => {
    cy.get('.searchCardTitle')
      .its('length')
      .then((initialCount) => {
        cy.scrollTo('bottom')
        // wait for next page to load
        cy.wait(1500)
        cy.get('.searchCardTitle').should(
          'have.length.greaterThan',
          initialCount
        )
        cy.scrollTo('top')
        // infinite scroll accumulates results — count must not drop after scrolling back up
        cy.get('.searchCardTitle').should(
          'have.length.greaterThan',
          initialCount
        )
      })
  })
})
