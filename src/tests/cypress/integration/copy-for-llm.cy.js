/// <reference types="cypress" />
import { writeLog } from '../support/functions'

describe('Copy for LLM Feature', () => {
  // Use a known, stable tutorial URL for testing
  const tutorialUrl = '/docs/tutorials/how-does-vtex-support-work'
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
      writeLog(`${this.currentTest.title} (${tutorialUrl})`)
    }
  })

  it('Should find the Copy for LLM button in English', () => {
    cy.visit(tutorialUrl)
    cy.contains('button', 'Copy for LLM', { timeout: 10000 }).should(
      'be.visible'
    )
  })

  it('Should copy content to clipboard in English and verify', () => {
    cy.visit(tutorialUrl)

    // Click the Copy for LLM button
    cy.contains('button', 'Copy for LLM').click()

    // Verify button changes to "Copied!"
    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      return win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
        copiedContents.en = text
        cy.log(`EN content length: ${text.length}`)
      })
    })

    // Wait for button to reset (the component resets after 10s)
    cy.wait(3000)
    cy.contains('button', 'Copy for LLM', { timeout: 10000 }).should(
      'be.visible'
    )
  })

  it('Should switch to Spanish and find Copiar para LLM button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Spanish
    cy.contains('ES').click()

    // Wait for page to load in Spanish
    cy.url({ timeout: 10000 }).should('include', '/es')

    // Verify Spanish button text
    cy.contains('button', 'Copiar para LLM').should('be.visible')
  })

  it('Should copy content in Spanish and verify it differs from English', () => {
    // Navigate to Spanish version
    const spanishUrl = tutorialUrl.replace('/docs/', '/es/docs/')
    cy.visit(spanishUrl)

    // Click the Spanish Copy button
    cy.contains('button', 'Copiar para LLM').click()

    // Verify button changes to "¡Copiado!"
    cy.contains('button', '¡Copiado!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      return win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
        copiedContents.es = text
        cy.log(`ES content length: ${text.length}`)

        // Verify Spanish content is different from English
        expect(text).to.not.equal(copiedContents.en)
        cy.log('✓ Spanish content differs from English content')
      })
    })
  })

  it('Should switch to Portuguese and find Copiar para LLM button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Portuguese
    cy.contains('PT').click()

    // Wait for page to load in Portuguese
    cy.url({ timeout: 10000 }).should('include', '/pt')

    // Verify Portuguese button text
    cy.contains('button', 'Copiar para LLM').should('be.visible')
  })

  it('Should copy content in Portuguese and verify it differs from English and Spanish', () => {
    // Navigate to Portuguese version
    const portugueseUrl = tutorialUrl.replace('/docs/', '/pt/docs/')
    cy.visit(portugueseUrl)

    // Click the Portuguese Copy button
    cy.contains('button', 'Copiar para LLM').click()

    // Verify button changes to "Copiado!"
    cy.contains('button', 'Copiado!', { timeout: 5000 }).should('be.visible')

    // Get clipboard content
    cy.window().then((win) => {
      return win.navigator.clipboard.readText().then((text) => {
        expect(text).to.not.be.empty
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
      // Check it contains markdown content
      expect(content).to.exist
      expect(content.trim()).to.not.be.empty

      // Verify it looks like markdown (has some typical markdown features)
      const hasMarkdownFeatures =
        content.includes('#') || // headers
        content.includes('```') || // code blocks
        content.includes('**') || // bold
        content.includes('*') || // italic/bold
        content.includes('[') // links

      expect(hasMarkdownFeatures).to.be.true
      cy.log(`✓ ${lang.toUpperCase()} content has proper markdown structure`)
    })
  })
})
