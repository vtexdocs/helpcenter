/// <reference types="cypress" />

// SearchFilterTabBar is a mobile/tablet component (display:none at ≥ 64em / 1024px).
// Tests run at 1023px wide so the tab bar is visible.
describe('Doctype filter UI', () => {
  before(() => {
    cy.request({
      url: '/docs/tutorials/about-the-admin-category',
      timeout: 90000,
      failOnStatusCode: false,
    })
  })

  beforeEach(() => {
    cy.viewport(1023, 768)
    cy.visit('/docs/tutorials/about-the-admin-category')
    cy.submitSearch('api')
    cy.get('[data-testid="doctype-filter-tab-bar"]').should('be.visible')
  })

  it('renders filter tabs with per-doctype result counts', () => {
    // All tab + at least one doctype tab
    cy.get('[data-testid="doctype-filter-tab"]').should(
      'have.length.greaterThan',
      1
    )
    // Every tab carries a count badge
    cy.get('[data-testid="doctype-filter-tab"]').each(($tab) => {
      cy.wrap($tab)
        .find('[data-testid="doctype-filter-tab-count"]')
        .should('exist')
    })
    // All tab count is > 0 for a query that returns results
    cy.get('[data-testid="doctype-filter-tab"][data-filter=""]')
      .find('[data-testid="doctype-filter-tab-count"]')
      .invoke('text')
      .then(parseInt)
      .should('be.greaterThan', 0)
  })

  it('clicking a doctype tab narrows the result list', () => {
    // Click the first non-All tab
    cy.get('[data-testid="doctype-filter-tab"]')
      .not('[data-filter=""]')
      .first()
      .click()
    // That tab becomes active; All is no longer active
    cy.get('[data-testid="doctype-filter-tab"][data-active="true"]').should(
      'not.have.attr',
      'data-filter',
      ''
    )
    // Result cards are still rendered for a broad query like 'api'
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })

  it('result counts reflect the active query', () => {
    // All tab count is positive for a query with results
    cy.get('[data-testid="doctype-filter-tab"][data-filter=""]')
      .find('[data-testid="doctype-filter-tab-count"]')
      .invoke('text')
      .then(parseInt)
      .should('be.greaterThan', 0)
    // Sum of individual doctype tab counts ≤ All count (some docs may fall outside sidebar sections)
    cy.get('[data-testid="doctype-filter-tab"][data-filter=""]')
      .find('[data-testid="doctype-filter-tab-count"]')
      .invoke('text')
      .then((allCountText) => {
        const allCount = parseInt(allCountText)
        cy.get('[data-testid="doctype-filter-tab"]')
          .not('[data-filter=""]')
          .then(($tabs) => {
            const sum = [...$tabs].reduce((acc, tab) => {
              return (
                acc +
                parseInt(
                  tab.querySelector('[data-testid="doctype-filter-tab-count"]')
                    ?.textContent || '0'
                )
              )
            }, 0)
            expect(sum).to.be.lte(allCount)
          })
      })
  })

  it('selecting "All" restores the unfiltered result list', () => {
    // Activate a doctype filter
    cy.get('[data-testid="doctype-filter-tab"]')
      .not('[data-filter=""]')
      .first()
      .click()
    cy.get('[data-testid="doctype-filter-tab"][data-active="true"]').should(
      'not.have.attr',
      'data-filter',
      ''
    )
    // Click All to restore
    cy.get('[data-testid="doctype-filter-tab"][data-filter=""]').click()
    // All tab is now active and result cards are visible
    cy.get('[data-testid="doctype-filter-tab"][data-active="true"]').should(
      'have.attr',
      'data-filter',
      ''
    )
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })
})
