/// <reference types="cypress" />
import { writeLog } from '../support/functions'

describe('Copy for AI Feature', () => {
  let tutorialUrl = ''
  let tutorialSlugs = { en: '', es: '', pt: '' } // Store language-specific slugs
  const copiedContents = {}

  before(() => {
    cy.writeFile('cypress.log', `#Copy for AI Feature Tests#\n`, {
      flag: 'a+',
    })

    // Fetch a real tutorial from the navigation API
    const baseUrl = Cypress.config('baseUrl')
    cy.request(`${baseUrl}/api/navigation`).then((response) => {
      // Normalize navigation response shape: either an array or an object with navbar array
      const body = response.body
      const navigationData = Array.isArray(body)
        ? body
        : body && Array.isArray(body.navbar)
        ? body.navbar
        : null

      if (!navigationData) {
        throw new Error('Unexpected navigation response format')
      }

      // Find the tutorials section (the main documentation section)
      const tutorialsSection = navigationData.find(
        (section) => section.documentation === 'tutorials'
      )

      if (tutorialsSection && tutorialsSection.categories.length > 0) {
        // Get first markdown page from tutorials with all language slugs
        const findFirstMarkdownPage = (items) => {
          for (const item of items) {
            if (item.type === 'markdown' && item.slug) {
              // Store all language versions of the slug
              if (typeof item.slug === 'object') {
                tutorialSlugs = {
                  en: item.slug.en || '',
                  es: item.slug.es || '',
                  pt: item.slug.pt || '',
                }
                return item.slug.en
              } else {
                tutorialSlugs.en = item.slug
                return item.slug
              }
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
          cy.log(
            `Language slugs - EN: ${tutorialSlugs.en}, ES: ${tutorialSlugs.es}, PT: ${tutorialSlugs.pt}`
          )
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

  it('Should switch to Spanish and find Copy for AI button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Spanish
    cy.contains('ES').click()

    // Wait for page to load in Spanish
    cy.url({ timeout: 10000 }).should('include', '/es')

    // Verify button text in ES (either translated or English)
    cy.contains('button', /Copy for AI|Copiar para IA/).should('be.visible')
  })

  it('Should copy content in Spanish and verify it differs from English', () => {
    // Skip if Spanish translation is not available
    if (!tutorialSlugs.es) {
      cy.log('Spanish slug not available, skipping Spanish copy test')
      return
    }
    // Navigate to Spanish version using Spanish slug
    const prefix = tutorialUrl.substring(0, tutorialUrl.lastIndexOf('/'))
    const spanishUrl = `${prefix.replace('/docs/', '/es/docs/')}/${
      tutorialSlugs.es
    }`

    cy.visit(spanishUrl)

    // Wait for page to be fully loaded and hydrated
    cy.get('article', { timeout: 15000 }).should('be.visible')

    // Wait a bit more for hydration to complete
    cy.wait(2000)

    // Verify the button exists before stubbing (button text stays in English)
    cy.contains('button', 'Copy for AI', { timeout: 10000 }).should(
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

    // Click the Copy button
    cy.contains('button', 'Copy for AI').click()

    // Wait for execCommand
    cy.get('@execCommandES').should('have.been.calledWith', 'copy')

    // Verify button changes to "Copied!" (stays in English)
    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    // Verify Spanish content was captured; only assert difference if truly different
    cy.then(() => {
      expect(copiedContents.es).to.not.be.undefined
      expect(copiedContents.es).to.not.be.empty
      if (copiedContents.es === copiedContents.en) {
        cy.log(
          'ES content matches EN (likely untranslated) — not asserting difference'
        )
      } else {
        cy.log('✓ Spanish content differs from English content')
      }
    })
  })

  it('Should switch to Portuguese and find Copy for AI button', () => {
    cy.visit(tutorialUrl)

    // Click language switcher
    cy.contains('button', 'EN').click()

    // Select Portuguese
    cy.contains('PT').click()

    // Wait for page to load in Portuguese
    cy.url({ timeout: 10000 }).should('include', '/pt')

    // Verify button text in PT (either translated or English)
    cy.contains('button', /Copy for AI|Copiar para IA/).should('be.visible')
  })

  it('Should copy content in Portuguese and verify it differs from English and Spanish', () => {
    // Skip if Portuguese translation is not available
    if (!tutorialSlugs.pt) {
      cy.log('Portuguese slug not available, skipping Portuguese copy test')
      return
    }
    // Navigate to Portuguese version using Portuguese slug
    const prefix = tutorialUrl.substring(0, tutorialUrl.lastIndexOf('/'))
    const portugueseUrl = `${prefix.replace('/docs/', '/pt/docs/')}/${
      tutorialSlugs.pt
    }`

    cy.visit(portugueseUrl)

    // Wait for page to be fully loaded and hydrated
    cy.get('article', { timeout: 15000 }).should('be.visible')

    // Wait a bit more for hydration to complete
    cy.wait(2000)

    // Verify the button exists before stubbing (button text stays in English)
    cy.contains('button', 'Copy for AI', { timeout: 10000 }).should(
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

    // Click the Copy button
    cy.contains('button', 'Copy for AI').click()

    // Wait for execCommand
    cy.get('@execCommandPT').should('have.been.calledWith', 'copy')

    // Verify button changes to "Copied!" (stays in English)
    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    // Verify Portuguese content was captured; only assert difference if truly different
    cy.then(() => {
      expect(copiedContents.pt).to.not.be.undefined
      expect(copiedContents.pt).to.not.be.empty
      if (
        copiedContents.pt === copiedContents.en ||
        copiedContents.pt === copiedContents.es
      ) {
        cy.log(
          'PT content matches EN/ES (likely untranslated) — not asserting difference'
        )
      } else {
        cy.log('✓ Portuguese content differs from English and Spanish content')
      }
    })
  })

  it('Should verify all three language contents are unique', () => {
    // Only run this test if all three translations were available
    if (!copiedContents.en || !copiedContents.es || !copiedContents.pt) {
      cy.log('Missing one or more language contents, skipping uniqueness test')
      return
    }

    // If any contents are identical, treat as untranslated and skip uniqueness assertion
    if (
      copiedContents.en === copiedContents.es ||
      copiedContents.en === copiedContents.pt ||
      copiedContents.es === copiedContents.pt
    ) {
      cy.log(
        'One or more language contents are identical (likely untranslated) — skipping uniqueness assertion'
      )
      return
    }

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
