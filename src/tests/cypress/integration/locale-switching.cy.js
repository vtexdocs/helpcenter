/// <reference types="cypress" />

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
  })

  it('should display language switcher on homepage and category pages', () => {
    cy.visit('/')
    cy.get('button')
      .contains(/^(EN|ES|PT)$/)
      .should('be.visible')

    cy.visit('/docs/tutorials/about-the-admin-category')
    cy.get('button')
      .contains(/^(EN|ES|PT)$/)
      .should('be.visible')
  })

  it('should switch locales correctly and update URL and sidebar links', () => {
    cy.visit('/docs/tutorials/about-the-admin-category')

    cy.get('button').contains('EN').should('be.visible')

    cy.get('button').contains('EN').click()
    cy.contains('PT').click()
    cy.url({ timeout: 10000 }).should('include', '/pt/')
    cy.get('button').contains('PT').should('be.visible')
    cy.get('a[href*="/pt/docs/"]').should('exist')

    cy.get('button').contains('PT').click()
    cy.contains('ES').click()
    cy.url({ timeout: 10000 }).should('include', '/es/')
    cy.get('button').contains('ES').should('be.visible')
    cy.get('a[href*="/es/docs/"]').should('exist')

    cy.get('button').contains('ES').click()
    cy.contains('EN').click()
    cy.url({ timeout: 10000 }).should('not.include', '/pt/')
    cy.url().should('not.include', '/es/')
    cy.get('button').contains('EN').should('be.visible')
  })

  it('should load direct locale URLs correctly for all languages', () => {
    cy.visit('/docs/tutorials')
    cy.get('button').contains('EN').should('be.visible')
    cy.url().should('not.include', '/pt/')
    cy.url().should('not.include', '/es/')

    cy.visit('/pt/docs/tutorials')
    cy.get('button').contains('PT').should('be.visible')
    cy.url().should('include', '/pt/')

    cy.visit('/es/docs/tutorials')
    cy.get('button').contains('ES').should('be.visible')
    cy.url().should('include', '/es/')
  })

  it('should maintain PT locale when navigating via sidebar', () => {
    cy.visit('/pt/docs/tutorials/sobre-o-admin-categoria')

    cy.get('button').contains('PT').should('be.visible')
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
    cy.get('a[href*="/es/docs/tutorials/"]')
      .filter(':visible')
      .first()
      .scrollIntoView()
      .click({ force: true })

    cy.url({ timeout: 15000 }).should('include', '/es/')
    cy.get('button').contains('ES').should('be.visible')
  })
})
