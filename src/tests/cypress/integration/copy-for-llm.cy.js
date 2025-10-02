/// <reference types="cypress" />
import { writeLog } from '../support/functions'

describe('Copy for AI Feature', () => {
  let tutorialUrl = ''
  const copiedContents = {}

  before(() => {
    cy.writeFile('cypress.log', `#Copy for AI Feature Tests#\n`, {
      flag: 'a+',
    })

    // Fetch a real tutorial from the navigation API
    const baseUrl = Cypress.config('baseUrl')
    cy.request(`${baseUrl}/api/navigation`).then((response) => {
      const navigationData = response.body.navbar

      // Find the tutorials section
      const tutorialsSection = navigationData.find(
        (section) => section.documentation === 'tutorials'
      )

      if (tutorialsSection && tutorialsSection.categories.length > 0) {
        // Get first markdown page from tutorials
        const findFirstMarkdownPage = (items) => {
          for (const item of items) {
            if (item.type === 'markdown' && item.slug) {
              const slug =
                typeof item.slug === 'object' ? item.slug.en : item.slug
              return slug
            }
            if (item.children && item.children.length > 0) {
              const found = findFirstMarkdownPage(item.children)
              if (found) return found
            }
          }
          return null
        }

        const slug = findFirstMarkdownPage(tutorialsSection.categories)
        if (slug) {
          const prefix = tutorialsSection.slugPrefix.endsWith('/')
            ? tutorialsSection.slugPrefix.slice(0, -1)
            : tutorialsSection.slugPrefix
          tutorialUrl = `${prefix}/${slug}`
          cy.log(`Using tutorial: ${tutorialUrl}`)
        } else {
          throw new Error('No markdown tutorial found in navigation')
        }
      } else {
        throw new Error('Tutorials section not found in navigation')
      }
    })
  })

  beforeEach(() => {
    // Handle hydration errors globally for all tests
    cy.on('uncaught:exception', (err) => {
      // Ignore hydration-related errors
      if (
        err.message.includes('Suspense boundary') ||
        err.message.includes('hydrating')
      ) {
        return false
      }
      return true
    })

    cy.viewport(1366, 768)
  })

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      writeLog(`${this.currentTest.title} (${tutorialUrl})`)
    }
  })

  it('Should find the Copy for AI button in English', () => {
    cy.visit(tutorialUrl)
    cy.contains('button', 'Copy for AI', { timeout: 10000 }).should(
      'be.visible'
    )
  })

  it('Should copy content to clipboard in English and verify', () => {
    // Intercept the API call
    cy.intercept('GET', '/api/llm-content*').as('llmContent')

    cy.visit(tutorialUrl)

    // Stub document.execCommand to capture copy operations
    cy.document().then((doc) => {
      cy.stub(doc, 'execCommand')
        .callsFake((command) => {
          if (command === 'copy') {
            // Get the selected text from the active element
            const activeElement = doc.activeElement
            if (activeElement && activeElement.value) {
              copiedContents.en = activeElement.value
            }
            return true // Simulate successful copy
          }
          return false
        })
        .as('execCommand')
    })

    // Click the Copy for AI button
    cy.contains('button', 'Copy for AI').click()

    // Wait for API response
    cy.wait('@llmContent').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body.content).to.exist
    })

    // Wait for execCommand to be called
    cy.get('@execCommand').should('have.been.calledWith', 'copy')

    // Verify button changes to "Copied!"
    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    // Verify content was captured
    cy.then(() => {
      expect(copiedContents.en).to.not.be.undefined
      expect(copiedContents.en).to.not.be.empty
      cy.log(`EN content length: ${copiedContents.en?.length || 0}`)
    })

    // Wait for button to reset (the component resets after 10s)
    cy.wait(3000)
    cy.contains('button', 'Copy for AI', { timeout: 10000 }).should(
      'be.visible'
    )
  })

  it('Should switch to Spanish and find Copiar para IA button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Spanish
    cy.contains('ES').click()

    // Wait for page to load in Spanish
    cy.url({ timeout: 10000 }).should('include', '/es')

    // Verify Spanish button text
    cy.contains('button', 'Copiar para IA').should('be.visible')
  })

  it('Should copy content in Spanish and verify it differs from English', () => {
    // Navigate to Spanish version
    const spanishUrl = tutorialUrl.replace('/docs/', '/es/docs/')

    cy.visit(spanishUrl)

    // Wait for page to be fully loaded and hydrated
    cy.get('article', { timeout: 15000 }).should('be.visible')

    // Wait a bit more for hydration to complete
    cy.wait(2000)

    // Verify the button exists before stubbing
    cy.contains('button', 'Copiar para IA', { timeout: 10000 }).should(
      'be.visible'
    )

    // Stub document.execCommand for Spanish
    cy.document().then((doc) => {
      cy.stub(doc, 'execCommand')
        .callsFake((command) => {
          if (command === 'copy') {
            const activeElement = doc.activeElement
            if (activeElement && activeElement.value) {
              copiedContents.es = activeElement.value
            }
            return true
          }
          return false
        })
        .as('execCommandES')
    })

    // Click the Spanish Copy button
    cy.contains('button', 'Copiar para IA').click()

    // Wait for execCommand
    cy.get('@execCommandES').should('have.been.calledWith', 'copy')

    // Verify button changes to "¡Copiado!"
    cy.contains('button', '¡Copiado!', { timeout: 5000 }).should('be.visible')

    // Verify Spanish content is different from English
    cy.then(() => {
      expect(copiedContents.es).to.not.be.undefined
      expect(copiedContents.es).to.not.be.empty
      expect(copiedContents.es).to.not.equal(copiedContents.en)
      cy.log('✓ Spanish content differs from English content')
    })
  })

  it('Should switch to Portuguese and find Copiar para IA button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Portuguese
    cy.contains('PT').click()

    // Wait for page to load in Portuguese
    cy.url({ timeout: 10000 }).should('include', '/pt')

    // Verify Portuguese button text
    cy.contains('button', 'Copiar para IA').should('be.visible')
  })

  it('Should copy content in Portuguese and verify it differs from English and Spanish', () => {
    // Navigate to Portuguese version
    const portugueseUrl = tutorialUrl.replace('/docs/', '/pt/docs/')

    cy.visit(portugueseUrl)

    // Wait for page to be fully loaded and hydrated
    cy.get('article', { timeout: 15000 }).should('be.visible')

    // Wait a bit more for hydration to complete
    cy.wait(2000)

    // Verify the button exists before stubbing
    cy.contains('button', 'Copiar para IA', { timeout: 10000 }).should(
      'be.visible'
    )

    // Stub document.execCommand for Portuguese
    cy.document().then((doc) => {
      cy.stub(doc, 'execCommand')
        .callsFake((command) => {
          if (command === 'copy') {
            const activeElement = doc.activeElement
            if (activeElement && activeElement.value) {
              copiedContents.pt = activeElement.value
            }
            return true
          }
          return false
        })
        .as('execCommandPT')
    })

    // Click the Portuguese Copy button
    cy.contains('button', 'Copiar para IA').click()

    // Wait for execCommand
    cy.get('@execCommandPT').should('have.been.calledWith', 'copy')

    // Verify button changes to "Copiado!"
    cy.contains('button', 'Copiado!', { timeout: 5000 }).should('be.visible')

    // Verify Portuguese content is different from both English and Spanish
    cy.then(() => {
      expect(copiedContents.pt).to.not.be.undefined
      expect(copiedContents.pt).to.not.be.empty
      expect(copiedContents.pt).to.not.equal(copiedContents.en)
      expect(copiedContents.pt).to.not.equal(copiedContents.es)
      cy.log('✓ Portuguese content differs from English and Spanish content')
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
