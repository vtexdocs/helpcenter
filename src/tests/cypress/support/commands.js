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
