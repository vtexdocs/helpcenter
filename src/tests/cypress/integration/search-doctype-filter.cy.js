/// <reference types="cypress" />

import { COLD_PREVIEW_TIMEOUT } from '../support/constants'

// SearchFilterTabBar is a mobile/tablet component (display:none at ≥ 64em / 1024px).
// beforeEach starts at 1280px so the header search input is visible, then narrows to 1023px
// after submitting so the tab bar becomes visible.
const DOCTYPE_FILTER_PAGE = '/docs/tutorials/about-the-admin-category'

describe('Doctype filter UI', () => {
  before(() => {
    // Warm the ISR cache for the exact page beforeEach visits so every cy.visit below is a
    // fast cache hit instead of a ~6-min cold render. A cold render here monopolizes origin
    // time and triggers the 403 cascade for later specs (B-5). A long timeout absorbs an
    // in-progress cold render; retry-until-200 (guarded) self-heals transient 403/5xx
    // throttling without consuming the whole before() timeout on a permanently failing route.
    const warmUp = (url, attempt = 0) => {
      cy.request({
        url,
        failOnStatusCode: false,
        timeout: COLD_PREVIEW_TIMEOUT,
      }).then((resp) => {
        if (resp.status !== 200 && attempt < 10)
          cy.wait(2000).then(() => warmUp(url, attempt + 1))
      })
    }
    warmUp(DOCTYPE_FILTER_PAGE)
  })

  beforeEach(() => {
    // Must be ≥ 1024px before visit/submit: searchContainer has display:['none','none','none','flex'],
    // so at the Cypress default 1000px the header search input is hidden and click() fails.
    cy.viewport(1280, 768)
    cy.visitWithRetry(DOCTYPE_FILTER_PAGE)
    cy.submitSearch('api')
    // Narrow after submit: SearchFilterTabBar is display:none at ≥ 1024px — 1023px makes it visible.
    cy.viewport(1023, 768)
    cy.get('[data-testid="doctype-filter-tab-bar"]').should('be.visible')
    // Wait for results to load so ocurrenceCount context is populated before any test runs.
    // The "All" tab count (ocurrenceCount[""]) arrives from the search backend after the
    // result cards render. The timeout must sit on the command that yields the count badge so
    // the chained .should() inherits the full retry window — on a split get(tab).find(count)
    // chain the assertion would only inherit the 5s defaultCommandTimeout and flake on slow
    // (cold preview) backend responses.
    cy.get(
      '[data-testid="doctype-filter-tab"][data-filter=""] [data-testid="doctype-filter-tab-count"]',
      { timeout: 20000 }
    ).should(($el) => {
      expect(parseInt($el.text())).to.be.greaterThan(0)
    })
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
