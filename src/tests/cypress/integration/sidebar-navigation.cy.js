/// <reference types="cypress" />

/**
 * Sidebar Navigation Tests
 *
 * Tests that sidebar navigation maintains correct locale context.
 * This specifically tests the fix for PR #402 - ensuring that clicking
 * sidebar links on locale-prefixed pages navigates to the correct
 * locale version of the target page.
 */
describe('Sidebar Navigation Tests', () => {
  let baseUrl

  before(() => {
    baseUrl = Cypress.config('baseUrl')

    // Use longer timeout and failOnStatusCode: false to handle slow/flaky Netlify previews
    cy.request({
      url: `${baseUrl}/api/navigation`,
      timeout: 60000,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 200) {
        cy.task(
          'log',
          `Warning: Navigation API returned status ${response.status}, proceeding with tests anyway`
        )
        return
      }

      const body = response.body
      const navigationData = Array.isArray(body)
        ? body
        : body && Array.isArray(body.navbar)
        ? body.navbar
        : null

      if (navigationData) {
        cy.task('log', '\n' + '='.repeat(80))
        cy.task('log', 'SIDEBAR NAVIGATION TESTS - Setup')
        cy.task('log', '='.repeat(80))
        cy.task('log', `Found ${navigationData.length} navigation sections`)
        cy.task('log', '='.repeat(80) + '\n')
      }
    })
  })

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
    cy.wait(500)
  })

  const clickVisibleSidebarLink = (hrefPattern, locale) => {
    cy.get(`a[href*="${hrefPattern}"]`)
      .filter(':visible')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .then(($link) => {
        const href = $link.attr('href')
        cy.task('log', `Clicking ${locale} sidebar link: ${href}`)
      })
    cy.get(`a[href*="${hrefPattern}"]`)
      .filter(':visible')
      .first()
      .click({ force: true })
  }

  describe('PT Locale - Sidebar Navigation', () => {
    it('should navigate to PT pages when clicking sidebar links from PT category page', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

      cy.get('button').contains('PT').should('be.visible')

      clickVisibleSidebarLink('/pt/docs/tutorials/', 'PT')

      cy.url({ timeout: 15000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
    })

    it('should maintain PT locale through multiple sidebar navigations', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

      cy.get('button').contains('PT').should('be.visible')

      clickVisibleSidebarLink('/pt/docs/tutorials/', 'PT')

      cy.url({ timeout: 15000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')

      cy.get('a[href*="/pt/docs/tutorials/"]')
        .filter(':visible')
        .then(($links) => {
          if ($links.length > 1) {
            cy.wrap($links.eq(1)).click()
            cy.url({ timeout: 15000 }).should('include', '/pt/')
            cy.get('button').contains('PT').should('be.visible')
          } else {
            cy.log('Only one PT sidebar link found, skipping second navigation')
          }
        })
    })

    it('should have sidebar links with /pt/ prefix on PT pages', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

      cy.get('button').contains('PT').should('be.visible')
      cy.get('a[href^="/pt/docs/"]').should('have.length.at.least', 1)
    })
  })

  describe('ES Locale - Sidebar Navigation', () => {
    it('should navigate to ES pages when clicking sidebar links from ES category page', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')

      cy.get('button').contains('ES').should('be.visible')

      clickVisibleSidebarLink('/es/docs/tutorials/', 'ES')

      cy.url({ timeout: 15000 }).should('include', '/es/')
      cy.get('button').contains('ES').should('be.visible')
    })

    it('should maintain ES locale through multiple sidebar navigations', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')

      cy.get('button').contains('ES').should('be.visible')

      clickVisibleSidebarLink('/es/docs/tutorials/', 'ES')

      cy.url({ timeout: 15000 }).should('include', '/es/')
      cy.get('button').contains('ES').should('be.visible')

      cy.get('a[href*="/es/docs/tutorials/"]')
        .filter(':visible')
        .then(($links) => {
          if ($links.length > 1) {
            cy.wrap($links.eq(1)).click()
            cy.url({ timeout: 15000 }).should('include', '/es/')
            cy.get('button').contains('ES').should('be.visible')
          } else {
            cy.log('Only one ES sidebar link found, skipping second navigation')
          }
        })
    })

    it('should have sidebar links with /es/ prefix on ES pages', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')

      cy.get('button').contains('ES').should('be.visible')
      cy.get('a[href^="/es/docs/"]').should('have.length.at.least', 1)
    })
  })

  describe('EN Locale - Sidebar Navigation (Default)', () => {
    it('should navigate without locale prefix when clicking sidebar links from EN page', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').should('be.visible')

      cy.get('a[href^="/docs/tutorials/"]')
        .not('[href*="/pt/"]')
        .not('[href*="/es/"]')
        .filter(':visible')
        .first()
        .should('be.visible')
        .then(($link) => {
          const href = $link.attr('href')
          cy.task('log', `Clicking EN sidebar link: ${href}`)
          expect(href).to.not.include('/pt/')
          expect(href).to.not.include('/es/')
        })

      cy.get('a[href^="/docs/tutorials/"]')
        .not('[href*="/pt/"]')
        .not('[href*="/es/"]')
        .filter(':visible')
        .first()
        .click()

      cy.url({ timeout: 15000 }).should('not.include', '/pt/')
      cy.url().should('not.include', '/es/')
      cy.get('button').contains('EN').should('be.visible')
    })

    it('should not have PT or ES prefixes in sidebar links on EN pages', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').should('be.visible')
      cy.get('a[href*="/pt/docs/"]').should('not.exist')
      cy.get('a[href*="/es/docs/"]').should('not.exist')
    })
  })

  describe('Cross-Section Navigation', () => {
    it('should maintain PT locale when navigating between different documentation sections', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')
      cy.get('button').contains('PT').should('be.visible')

      clickVisibleSidebarLink('/pt/docs/', 'PT')

      cy.url({ timeout: 15000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
      cy.get('a[href*="/pt/docs/"]').should('exist')
    })

    it('should maintain ES locale when navigating between different documentation sections', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')
      cy.get('button').contains('ES').should('be.visible')

      clickVisibleSidebarLink('/es/docs/', 'ES')

      cy.url({ timeout: 15000 }).should('include', '/es/')
      cy.get('button').contains('ES').should('be.visible')
      cy.get('a[href*="/es/docs/"]').should('exist')
    })
  })

  describe('Locale Switching After Sidebar Navigation', () => {
    it('should allow locale switch to work correctly after sidebar navigation on PT', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')
      cy.get('button').contains('PT').should('be.visible')

      clickVisibleSidebarLink('/pt/docs/tutorials/', 'PT')

      cy.url({ timeout: 15000 }).should('include', '/pt/')

      cy.get('button').contains('PT').click()
      cy.contains('EN').click()

      cy.url({ timeout: 10000 }).should('not.include', '/pt/')
      cy.get('button').contains('EN').should('be.visible')
    })

    it('should allow locale switch to work correctly after sidebar navigation on ES', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')
      cy.get('button').contains('ES').should('be.visible')

      clickVisibleSidebarLink('/es/docs/tutorials/', 'ES')

      cy.url({ timeout: 15000 }).should('include', '/es/')

      cy.get('button').contains('ES').click()
      cy.contains('PT').click()

      cy.url({ timeout: 10000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
    })
  })
})
