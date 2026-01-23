/// <reference types="cypress" />

/**
 * Locale Switching Tests
 *
 * Tests the language switcher functionality across different page types.
 * Verifies that:
 * - Language switcher is visible and functional
 * - URL changes correctly when switching locales
 * - Sidebar links reflect the correct locale
 */
describe('Locale Switching Tests', () => {
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

  describe('Language Switcher Visibility', () => {
    it('should display language switcher on the homepage', () => {
      cy.visit('/')
      cy.get('button')
        .contains(/^(EN|ES|PT)$/)
        .should('be.visible')
    })

    it('should display language switcher on category pages', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')
      cy.get('button')
        .contains(/^(EN|ES|PT)$/)
        .should('be.visible')
    })
  })

  describe('Language Switching on Category Pages', () => {
    it('should switch from EN to PT and update URL', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').should('be.visible')
      cy.get('button').contains('EN').click()
      cy.contains('PT').click()

      cy.url({ timeout: 10000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
    })

    it('should switch from EN to ES and update URL', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').should('be.visible')
      cy.get('button').contains('EN').click()
      cy.contains('ES').click()

      cy.url({ timeout: 10000 }).should('include', '/es/')
      cy.get('button').contains('ES').should('be.visible')
    })

    it('should switch from PT to EN and update URL', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

      cy.get('button').contains('PT').should('be.visible')
      cy.get('button').contains('PT').click()
      cy.contains('EN').click()

      cy.url({ timeout: 10000 }).should('not.include', '/pt/')
      cy.get('button').contains('EN').should('be.visible')
    })

    it('should switch from ES to PT and update URL', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')

      cy.get('button').contains('ES').should('be.visible')
      cy.get('button').contains('ES').click()
      cy.contains('PT').click()

      cy.url({ timeout: 10000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
    })
  })

  describe('Sidebar Links After Locale Switch', () => {
    it('should have correct locale in sidebar links after switching to PT', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').click()
      cy.contains('PT').click()

      cy.url({ timeout: 10000 }).should('include', '/pt/')
      cy.get('a[href*="/pt/docs/"]').should('exist')
    })

    it('should have correct locale in sidebar links after switching to ES', () => {
      cy.visit('/docs/tutorials/about-the-admin-category')

      cy.get('button').contains('EN').click()
      cy.contains('ES').click()

      cy.url({ timeout: 10000 }).should('include', '/es/')
      cy.get('a[href*="/es/docs/"]').should('exist')
    })
  })

  describe('Direct Locale URL Access', () => {
    it('should load PT page directly and show correct locale', () => {
      cy.visit('/pt/docs/tutorials')

      cy.get('button').contains('PT').should('be.visible')
      cy.url().should('include', '/pt/')
    })

    it('should load ES page directly and show correct locale', () => {
      cy.visit('/es/docs/tutorials')

      cy.get('button').contains('ES').should('be.visible')
      cy.url().should('include', '/es/')
    })

    it('should load EN page directly (default locale, no prefix)', () => {
      cy.visit('/docs/tutorials')

      cy.get('button').contains('EN').should('be.visible')
      cy.url().should('not.include', '/pt/')
      cy.url().should('not.include', '/es/')
    })
  })

  describe('Locale Persistence Through Navigation', () => {
    it('should maintain PT locale when navigating via sidebar', () => {
      cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

      cy.get('button').contains('PT').should('be.visible')
      // Filter for visible sidebar links only (some may be in collapsed sections)
      // Use scrollIntoView to handle fixed position elements
      cy.get('a[href*="/pt/docs/tutorials/"]')
        .filter(':visible')
        .first()
        .scrollIntoView()
        .click({ force: true })

      cy.url({ timeout: 15000 }).should('include', '/pt/')
      cy.get('button').contains('PT').should('be.visible')
    })

    it('should maintain ES locale when navigating via sidebar', () => {
      cy.visit('/es/docs/tutorials/acerca-de-admin-categoria')

      cy.get('button').contains('ES').should('be.visible')
      // Filter for visible sidebar links only (some may be in collapsed sections)
      // Use scrollIntoView to handle fixed position elements
      cy.get('a[href*="/es/docs/tutorials/"]')
        .filter(':visible')
        .first()
        .scrollIntoView()
        .click({ force: true })

      cy.url({ timeout: 15000 }).should('include', '/es/')
      cy.get('button').contains('ES').should('be.visible')
    })
  })
})
