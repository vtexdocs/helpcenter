/// <reference types="cypress" />

describe('Search pagination / infinite scroll', () => {
  beforeEach(() => {
    cy.viewport(1366, 768)
    cy.visit('/', { timeout: 60000 })
    cy.submitSearch('api')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })

  it('loads more results when scrolled to the bottom', () => {
    cy.get('.searchCardTitle')
      .its('length')
      .then((firstPageCount) => {
        cy.intercept('POST', /algolia\.net/).as('algoliaNextPage')
        cy.scrollTo('bottom')
        cy.wait('@algoliaNextPage')
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
      cy.intercept('POST', /algolia\.net/).as('algoliaNextPage')
      cy.scrollTo('bottom')
      cy.wait('@algoliaNextPage')
      cy.get('.searchCardTitle').should(
        'have.length.greaterThan',
        firstPageTitles.size
      )
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
        cy.intercept('POST', /algolia\.net/).as('algoliaNextPage')
        cy.scrollTo('bottom')
        cy.wait('@algoliaNextPage')
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
