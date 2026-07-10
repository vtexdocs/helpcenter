/// <reference types="cypress" />

// SearchFilterTabBar is a mobile/tablet component (display:none at ≥ 64em / 1024px).
// Tests start at 1280px so the header search input is visible, then narrow to 1023px
// after submitting so the tab bar becomes visible.
const DOCTYPE_FILTER_PAGE = '/docs/tutorials/about-the-admin-category'
const COUNTS_ENDPOINT = '**/api/search/counts*'
const TAB = '[data-testid="doctype-filter-tab"]'
const TAB_COUNT = '[data-testid="doctype-filter-tab-count"]'
const ALL_TAB = '[data-testid="doctype-filter-tab"][data-filter=""]'

// Reads the numeric badge of a tab element, or null when it carries no badge.
const badgeValue = (tab) => {
  const el = tab.querySelector('[data-testid="doctype-filter-tab-count"]')
  if (!el) return null
  const text = (el.textContent || '').trim()
  // The display cap renders large totals as "999+".
  if (text === '999+') return 999
  const n = parseInt(text, 10)
  return Number.isNaN(n) ? null : n
}

// Submits a query from the header (needs ≥ 1024px), then narrows so the tab bar shows.
const submitAndRevealTabs = (query) => {
  cy.viewport(1280, 768)
  cy.submitSearch(query)
  cy.viewport(1023, 768)
  cy.get('[data-testid="doctype-filter-tab-bar"]').should('be.visible')
}

describe('Doctype filter UI (counts endpoint)', () => {
  beforeEach(() => {
    cy.viewport(1280, 768)
    cy.visitWithRetry(DOCTYPE_FILTER_PAGE)
    // Capture the single counts request so tests can compare the "All" badge to `total`.
    cy.intercept('GET', COUNTS_ENDPOINT).as('counts')
    submitAndRevealTabs('api')
    // The "All" badge (ocurrenceCount['']) arrives from the counts endpoint after the
    // result cards render. The timeout sits on the command that yields the badge so the
    // chained .should() inherits the full retry window (cold-preview backend latency).
    cy.get(`${ALL_TAB} ${TAB_COUNT}`, { timeout: 20000 }).should(($el) => {
      expect(parseInt($el.text(), 10)).to.be.greaterThan(0)
    })
    cy.wait('@counts', { timeout: 20000 }).then(({ response }) => {
      cy.wrap(response?.body).as('countsBody')
    })
  })

  it('renders filter tabs with per-doctype result counts', () => {
    cy.get(TAB).should('have.length.greaterThan', 1)
    cy.get(ALL_TAB)
      .find(TAB_COUNT)
      .invoke('text')
      .then((t) => parseInt(t, 10))
      .should('be.greaterThan', 0)
  })

  it('per-type counts are not all-equal for a broad query', () => {
    // Regression guard: the earlier fan-out approach returned identical counts for
    // every doctype. Enabled per-type tabs must expose more than one distinct value.
    cy.get(TAB)
      .not('[data-filter=""]')
      .then(($tabs) => {
        const values = [...$tabs]
          .filter((t) => t.getAttribute('data-disabled') !== 'true')
          .map(badgeValue)
          .filter((v) => v !== null)
        if (values.length < 2) return // only one enabled type: nothing to compare
        const distinct = new Set(values)
        expect(distinct.size, 'distinct per-type counts').to.be.greaterThan(1)
      })
  })

  it('"All" equals the total reported by the counts endpoint', () => {
    cy.get('@countsBody').then((body) => {
      expect(body, 'counts response body').to.exist
      const expected = body.total >= 1000 ? '999+' : String(body.total)
      cy.get(ALL_TAB).find(TAB_COUNT).invoke('text').should('eq', expected)
    })
  })

  it('sum of per-type counts is ≤ the "All" count', () => {
    cy.get(ALL_TAB)
      .find(TAB_COUNT)
      .invoke('text')
      .then((allText) => {
        const allCount = parseInt(allText, 10)
        cy.get(TAB)
          .not('[data-filter=""]')
          .then(($tabs) => {
            const sum = [...$tabs].reduce(
              (acc, tab) => acc + (badgeValue(tab) || 0),
              0
            )
            expect(sum).to.be.lte(allCount)
          })
      })
  })

  it('counts are stable when more results load (independent of page size)', () => {
    const snapshot = () =>
      cy
        .get(TAB)
        .then(($tabs) =>
          [...$tabs].map(
            (t) => `${t.getAttribute('data-filter')}:${badgeValue(t)}`
          )
        )
    snapshot().then((before) => {
      // Load a deeper page of the unfiltered list; counts must not shift with it.
      cy.scrollTo('bottom')
      cy.wait(500)
      snapshot().then((after) => {
        expect(after).to.deep.equal(before)
      })
    })
  })

  it('zero-count and known-issues tabs are disabled and not selectable', () => {
    cy.get(
      '[data-testid="doctype-filter-tab"][data-filter="known-issues"]'
    ).should('have.attr', 'data-disabled', 'true')
    cy.get(`${TAB}[data-disabled="true"]`).then(($disabled) => {
      if (!$disabled.length) return
      const filter = $disabled.eq(0).attr('data-filter')
      cy.wrap($disabled.eq(0)).click()
      // Clicking a disabled tab does not activate it.
      cy.get(`${TAB}[data-active="true"]`).should(
        'not.have.attr',
        'data-filter',
        filter
      )
    })
  })

  it('clicking a doctype tab narrows the list; "All" restores it', () => {
    cy.get(TAB)
      .not('[data-filter=""]')
      .filter('[data-disabled="false"]')
      .first()
      .click()
    cy.get(`${TAB}[data-active="true"]`).should(
      'not.have.attr',
      'data-filter',
      ''
    )
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)

    cy.get(ALL_TAB).click()
    cy.get(`${TAB}[data-active="true"]`).should('have.attr', 'data-filter', '')
    cy.get('.searchCardTitle').should('have.length.greaterThan', 0)
  })

  it('changing the query updates the counts and the result list (no stale results)', () => {
    cy.get('.searchCardTitle')
      .first()
      .invoke('text')
      .then((firstTitleBefore) => {
        cy.get(ALL_TAB)
          .find(TAB_COUNT)
          .invoke('text')
          .then((allBefore) => {
            cy.intercept('GET', COUNTS_ENDPOINT).as('counts2')
            submitAndRevealTabs('order')
            cy.wait('@counts2', { timeout: 20000 })
            // The result list must reflect the new query, never the previous hits.
            cy.get('.searchCardTitle', { timeout: 20000 })
              .should('have.length.greaterThan', 0)
              .first()
              .invoke('text')
              .should((firstTitleAfter) => {
                expect(firstTitleAfter.trim()).to.not.equal(
                  firstTitleBefore.trim()
                )
              })
            cy.get(ALL_TAB)
              .find(TAB_COUNT)
              .invoke('text')
              .should((allAfter) => {
                expect(allAfter).to.not.equal(allBefore)
              })
          })
      })
  })

  it('result snippets are plain text (no markdown/mermaid) and do not overflow', () => {
    cy.get('.searchCardDescription').should('have.length.greaterThan', 0)
    cy.get('.searchCardDescription').each(($desc) => {
      const text = $desc.text()
      expect(text, 'no fenced code blocks').to.not.include('```')
      expect(text, 'no markdown link/image syntax').to.not.match(/\]\(/)
      expect(text, 'no horizontal-rule / separator runs').to.not.match(/---/)
      // Snippet box is clamped: content must not overflow horizontally.
      const el = $desc[0]
      expect(el.scrollWidth, 'no horizontal overflow').to.be.at.most(
        el.clientWidth + 1
      )
    })
  })
})

describe('Doctype filter UI — counts request failure', () => {
  beforeEach(() => {
    cy.viewport(1280, 768)
    cy.visitWithRetry(DOCTYPE_FILTER_PAGE)
    // Force the counts endpoint to fail before the search fires.
    cy.intercept('GET', COUNTS_ENDPOINT, { statusCode: 500, body: {} }).as(
      'countsFail'
    )
    submitAndRevealTabs('api')
    cy.wait('@countsFail', { timeout: 20000 })
  })

  it('renders every tab with no badge, still clickable', () => {
    cy.get(TAB).should('have.length.greaterThan', 1)
    // No tab shows a count badge when the counts request fails.
    cy.get(TAB_COUNT).should('not.exist')
    // Tabs remain interactive: selecting one still narrows to that doctype.
    cy.get(TAB).not('[data-filter=""]').first().click()
    cy.get(`${TAB}[data-active="true"]`).should(
      'not.have.attr',
      'data-filter',
      ''
    )
  })
})

describe('Search proxy CDN cache-key regression (edge)', () => {
  const LOCALE = 'en'
  const Q_ALPHA = 'alpha111cdnreg'
  const Q_BETA = 'beta222cdnreg'

  it('GET /api/search/counts returns distinct bodies per query at the CDN edge', () => {
    cy.request({
      url: `/api/search/counts?q=${encodeURIComponent(
        Q_ALPHA
      )}&locale=${LOCALE}`,
      failOnStatusCode: false,
    }).then((resA) => {
      expect(resA.status).to.eq(200)
      expect(resA.body.query, 'counts body reflects first query').to.eq(Q_ALPHA)

      cy.request({
        url: `/api/search/counts?q=${encodeURIComponent(
          Q_BETA
        )}&locale=${LOCALE}`,
        failOnStatusCode: false,
      }).then((resB) => {
        expect(resB.status).to.eq(200)
        expect(resB.body.query, 'counts body reflects second query').to.eq(
          Q_BETA
        )
        expect(
          resB.body,
          'distinct counts per query at edge'
        ).to.not.deep.equal(resA.body)
      })
    })
  })

  it('GET /api/search returns distinct bodies per query at the CDN edge', () => {
    cy.request({
      url: `/api/search?q=${encodeURIComponent(Q_ALPHA)}&locale=${LOCALE}`,
      failOnStatusCode: false,
    }).then((resA) => {
      expect(resA.status).to.eq(200)
      expect(resA.body.query, 'search body reflects first query').to.eq(Q_ALPHA)

      cy.request({
        url: `/api/search?q=${encodeURIComponent(Q_BETA)}&locale=${LOCALE}`,
        failOnStatusCode: false,
      }).then((resB) => {
        expect(resB.status).to.eq(200)
        expect(resB.body.query, 'search body reflects second query').to.eq(
          Q_BETA
        )
        expect(
          resB.body,
          'distinct search results per query at edge'
        ).to.not.deep.equal(resA.body)
      })
    })
  })
})

describe('Search request shape — counts without per-doctype fan-out', () => {
  it('issues /api/search/counts and no per-doctype /api/search fan-out', () => {
    cy.viewport(1280, 768)
    cy.visitWithRetry(DOCTYPE_FILTER_PAGE)
    cy.intercept('GET', COUNTS_ENDPOINT).as('counts')
    cy.intercept('GET', '**/api/search?*').as('search')
    submitAndRevealTabs('api')
    cy.wait('@counts', { timeout: 20000 })
    cy.get('@search.all').then((interceptions) => {
      const fanOut = interceptions.filter(({ request }) =>
        request.url.includes('doctype=')
      )
      expect(fanOut, 'no per-doctype search fan-out').to.have.length(0)
    })
  })
})

describe('Autocomplete unchanged by snippet hardening', () => {
  beforeEach(() => {
    cy.viewport(1280, 768)
    cy.visitWithRetry(DOCTYPE_FILTER_PAGE)
  })

  it('shows suggestions with plain-text snippets while typing', () => {
    cy.searchFor('api')
    cy.getAutocompleteSuggestions()
      .should('have.length.greaterThan', 0)
      .each(($a) => {
        expect($a.text()).to.not.include('```')
      })
  })
})
