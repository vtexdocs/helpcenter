// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { COLD_PREVIEW_TIMEOUT } from './constants'

// Resilient cy.visit for the Netlify deploy preview (B-5): cold/cache-miss doc pages
// intermittently return 403/5xx or exceed the page-load timeout under sustained CI load.
// visitWithRetry visits directly and retries on non-2xx (detected via cy.intercept) with
// exponential backoff — one request per visit instead of the old gate+visit pair.
// Retry options (maxAttempts/initialBackoff/maxBackoff/requestTimeout) are stripped here;
// any remaining option (timeout, onBeforeLoad, …) passes through to cy.visit.
Cypress.Commands.add('visitWithRetry', (url, options = {}) => {
  const {
    maxAttempts = 5,
    initialBackoff = 2000,
    maxBackoff = 16000,
    requestTimeout = COLD_PREVIEW_TIMEOUT,
    ...visitOptions
  } = options

  // CYPRESS_PRE_VISIT_SETTLE_MS spaces out page-load bursts to stay under
  // Netlify's per-IP abuse heuristic (B-5). 0 disables the settle.
  const settle = (() => {
    const raw = Cypress.env('PRE_VISIT_SETTLE_MS')
    if (raw === undefined) return 1500
    const ms = Number(raw)
    return Number.isFinite(ms) ? ms : 1500
  })()

  const attempt = (n, backoff) => {
    if (settle > 0) cy.wait(settle)
    // Capture the page-load HTTP status via intercept so we can retry on 403/5xx
    // without a separate cy.request gate (halves per-visit origin hits).
    const alias = `_vwr_${n}`
    cy.intercept('GET', url).as(alias)
    cy.visit(url, {
      timeout: requestTimeout,
      ...visitOptions,
      failOnStatusCode: false,
    })
    cy.wait(`@${alias}`).then((interception) => {
      const status = interception.response?.statusCode ?? 200
      // 3xx redirects are fine — cy.visit follows them automatically.
      // Only retry on 4xx/5xx (rate-limiting, server errors).
      if (status < 400) return
      if (n >= maxAttempts) {
        throw new Error(
          `visitWithRetry: ${url} returned HTTP ${status} after ${maxAttempts} attempts`
        )
      }
      cy.wait(backoff).then(() =>
        attempt(n + 1, Math.min(backoff * 2, maxBackoff))
      )
    })
  }

  attempt(1, initialBackoff)
})

Cypress.Commands.add('any', { prevSubject: 'element' }, (subject, size = 1) => {
  cy.wrap(subject).then((elementList) => {
    elementList = elementList.jquery ? elementList.get() : elementList
    elementList = Cypress._.sampleSize(elementList, size)
    elementList = elementList.length > 1 ? elementList : elementList[0]
    cy.wrap(elementList)
  })
})

Cypress.Commands.add('anyWithIndex', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).then((obj) => {
    cy.wrap(obj)
      .its('length')
      .then((length) => Cypress._.random(0, length - 1))
      .then((randomIndex) => {
        return cy.wrap([obj.eq(randomIndex), randomIndex])
      })
  })
})

Cypress.Commands.add('switchLocale', (targetLocale) => {
  const localeMap = { en: 'EN', es: 'ES', pt: 'PT' }
  const targetLabel =
    localeMap[targetLocale.toLowerCase()] || targetLocale.toUpperCase()

  cy.get('button')
    .contains(/^(EN|ES|PT)$/)
    .click()

  cy.contains(targetLabel).click()

  if (targetLocale.toLowerCase() === 'en') {
    cy.url({ timeout: 10000 }).should('not.match', /\/(pt|es)\//)
  } else {
    cy.url({ timeout: 10000 }).should(
      'include',
      `/${targetLocale.toLowerCase()}/`
    )
  }

  cy.get('button').contains(targetLabel).should('be.visible')
})

Cypress.Commands.add('verifyLocale', (expectedLocale) => {
  const localeMap = { en: 'EN', es: 'ES', pt: 'PT' }
  const expectedLabel =
    localeMap[expectedLocale.toLowerCase()] || expectedLocale.toUpperCase()

  cy.get('button').contains(expectedLabel).should('be.visible')

  if (expectedLocale.toLowerCase() === 'en') {
    cy.url().should('not.match', /\/(pt|es)\//)
  } else {
    cy.url().should('include', `/${expectedLocale.toLowerCase()}/`)
  }
})

Cypress.Commands.add('searchFor', (query) => {
  cy.get('[data-cy="search"]').first().parent().click()
  cy.get('[data-cy="search"]').first().clear().type(query)
})

// Traversal is fragile: SearchInput from @vtexdocs/components has no data-cy on the
// dropdown container. Update this command if the DOM structure changes.
Cypress.Commands.add('getAutocompleteSuggestions', () =>
  cy.get('[data-cy="search"]').first().parent().parent().find('a')
)

Cypress.Commands.add('submitSearch', (query) => {
  cy.searchFor(query)
  cy.get('[data-cy="search"]').first().type('{enter}')
})

Cypress.Commands.add('clickSidebarLink', (options = {}) => {
  const { locale, index = 0 } = options

  let selector = 'nav a, aside a'
  if (locale && locale.toLowerCase() !== 'en') {
    selector = `nav a[href*="/${locale.toLowerCase()}/"], aside a[href*="/${locale.toLowerCase()}/"]`
  } else if (locale && locale.toLowerCase() === 'en') {
    selector =
      'nav a[href^="/docs/"], nav a[href^="/tutorials/"], nav a[href^="/tracks/"], aside a[href^="/docs/"], aside a[href^="/tutorials/"], aside a[href^="/tracks/"]'
  }

  cy.get(selector).should('exist').eq(index).click()
})
