/// <reference types="cypress" />
import { filterSidebarItems, writeLog } from '../support/functions'

describe('Copy for LLM Feature', () => {
  let randomTutorialUrl = ''
  const copiedContents = {}

  before(() => {
    cy.writeFile('cypress.log', `#Copy for LLM Feature Tests#\n`, {
      flag: 'a+',
    })
  })

  beforeEach(() => {
    cy.viewport(1366, 768)
  })

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      writeLog(`${this.currentTest.title} (${randomTutorialUrl})`)
    }
  })

  it('Should navigate to a random tutorial page', () => {
    cy.visit('/docs/tutorials')
    cy.get('.toggleIcon').should('be.visible').click()
    cy.get('[data-cy="sidebar-section"]').should('be.visible')

    // Select random category
    cy.get('.sidebar-component > div', { timeout: 10000 })
      .filter(filterSidebarItems)
      .anyWithIndex()
      .then(([category, index]) => {
        cy.wrap(index).as('idx')
        return cy.wrap(category)
      })
      .find('button')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true })

    // Select random tutorial
    cy.get('@idx').then((idx) => {
      cy.get('.sidebar-component > div', { timeout: 1000 })
        .eq(idx * 3 + 1)
        .find('.sidebar-component > div')
        .filter(filterSidebarItems)
        .anyWithIndex()
        .then(([element]) => {
          if (element.find('button').length)
            return cy.wrap(element).find('button')
          return cy.wrap(element).find('a')
        })
        .click()
    })

    cy.url({ timeout: 10000 })
      .should('match', /(\/tutorials\/)/)
      .then((url) => {
        randomTutorialUrl = url
        cy.log(`Testing with tutorial: ${url}`)
      })
  })

  it('Should find the Copy for LLM button in English', () => {
    cy.visit(randomTutorialUrl)
    cy.contains('button', 'Copy for LLM').should('be.visible')
  })

  it('Should copy content to clipboard in English and verify', () => {
    cy.visit(randomTutorialUrl)

    // Click the Copy for LLM button
    cy.contains('button', 'Copy for LLM').click()

    // Verify button changes to "Copied!"
    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
        expect(text).to.include('---') // Should have frontmatter
        expect(text).to.include('title:')
        copiedContents.en = text
        cy.log(`EN content length: ${text.length}`)
      })
    })

    // Verify button resets after timeout (wait a bit, not full 10s)
    cy.wait(2000)
    cy.contains('button', 'Copy for LLM').should('be.visible')
  })

  it('Should switch to Spanish and find Copiar para LLM button', () => {
    cy.visit(randomTutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Spanish
    cy.contains('ES').click()

    // Wait for page to load in Spanish
    cy.url({ timeout: 10000 }).should('include', '/es/')

    // Verify Spanish button text
    cy.contains('button', 'Copiar para LLM').should('be.visible')
  })

  it('Should copy content in Spanish and verify it differs from English', () => {
    // Navigate to Spanish version
    const spanishUrl = randomTutorialUrl.replace('/docs/', '/es/docs/')
    cy.visit(spanishUrl)

    // Click the Spanish Copy button
    cy.contains('button', 'Copiar para LLM').click()

    // Verify button changes to "¡Copiado!"
    cy.contains('button', '¡Copiado!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
        expect(text).to.include('---') // Should have frontmatter
        expect(text).to.include('title:')
        copiedContents.es = text
        cy.log(`ES content length: ${text.length}`)

        // Verify Spanish content is different from English
        expect(text).to.not.equal(copiedContents.en)
        cy.log('✓ Spanish content differs from English content')
      })
    })
  })

  it('Should switch to Portuguese and find Copiar para LLM button', () => {
    cy.visit(randomTutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Portuguese
    cy.contains('PT').click()

    // Wait for page to load in Portuguese
    cy.url({ timeout: 10000 }).should('include', '/pt/')

    // Verify Portuguese button text
    cy.contains('button', 'Copiar para LLM').should('be.visible')
  })

  it('Should copy content in Portuguese and verify it differs from English and Spanish', () => {
    // Navigate to Portuguese version
    const portugueseUrl = randomTutorialUrl.replace('/docs/', '/pt/docs/')
    cy.visit(portugueseUrl)

    // Click the Portuguese Copy button
    cy.contains('button', 'Copiar para LLM').click()

    // Verify button changes to "Copiado!"
    cy.contains('button', 'Copiado!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
        expect(text).to.include('---') // Should have frontmatter
        expect(text).to.include('title:')
        copiedContents.pt = text
        cy.log(`PT content length: ${text.length}`)

        // Verify Portuguese content is different from both English and Spanish
        expect(text).to.not.equal(copiedContents.en)
        expect(text).to.not.equal(copiedContents.es)
        cy.log('✓ Portuguese content differs from English and Spanish content')
      })
    })
  })

  it('Should verify all three language contents are unique', () => {
    expect(copiedContents.en).to.exist
    expect(copiedContents.es).to.exist
    expect(copiedContents.pt).to.exist

    // Ensure all three are different
    const contentsArray = [
      copiedContents.en,
      copiedContents.es,
      copiedContents.pt,
    ]
    const uniqueContents = new Set(contentsArray)

    expect(uniqueContents.size).to.equal(3)
    cy.log('✓ All three language contents are unique')

    // Log summary
    cy.log('Content Summary:')
    cy.log(`EN: ${copiedContents.en.length} chars`)
    cy.log(`ES: ${copiedContents.es.length} chars`)
    cy.log(`PT: ${copiedContents.pt.length} chars`)
  })

  it('Should verify copied content includes proper markdown structure', () => {
    Object.entries(copiedContents).forEach(([lang, content]) => {
      // Check frontmatter exists
      expect(content).to.match(/^---\n/)
      expect(content).to.include('title:')
      expect(content).to.include('locale:')

      // Check it contains markdown content after frontmatter
      const contentAfterFrontmatter = content.split('---')[2]
      expect(contentAfterFrontmatter).to.exist
      expect(contentAfterFrontmatter.trim()).to.not.be.empty

      cy.log(`✓ ${lang.toUpperCase()} content has proper markdown structure`)
    })
  })
})
