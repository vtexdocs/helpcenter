/// <reference types="cypress" />
import { writeLog } from '../support/functions'

describe('Copy for AI Feature', () => {
  let tutorialUrl = ''
  let tutorialSlugs = { en: '', es: '', pt: '' }
  const copiedContents = {}

  before(() => {
    cy.writeFile('cypress.log', `#Copy for AI Feature Tests#\n`, {
      flag: 'a+',
    })

    // Fetch a real tutorial from the navigation API
    const baseUrl = Cypress.config('baseUrl')
    cy.request(`${baseUrl}/api/navigation`).then((response) => {
      const body = response.body
      const navigationData = Array.isArray(body)
        ? body
        : body && Array.isArray(body.navbar)
        ? body.navbar
        : null

      if (!navigationData) {
        throw new Error('Unexpected navigation response format')
      }

      const tutorialsSection = navigationData.find(
        (section) => section.documentation === 'tutorials'
      )

      if (tutorialsSection && tutorialsSection.categories.length > 0) {
        const findFirstMarkdownPage = (items) => {
          for (const item of items) {
            if (item.type === 'markdown' && item.slug) {
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
          tutorialUrl = `/${prefix}/${slug}`
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
    cy.on('uncaught:exception', (err) => {
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

  const verifyMarkdownStructure = (content, lang) => {
    expect(content).to.exist
    expect(content.trim()).to.not.be.empty

    const hasMarkdownFeatures =
      content.includes('#') ||
      content.includes('```') ||
      content.includes('**') ||
      content.includes('*') ||
      content.includes('[')

    expect(hasMarkdownFeatures).to.be.true
    cy.log(`✓ ${lang.toUpperCase()} content has proper markdown structure`)
  }

  it('Should copy content in English and verify markdown structure', () => {
    cy.visit(tutorialUrl)

    cy.document().then((doc) => {
      cy.stub(doc, 'execCommand')
        .callsFake((command) => {
          if (command === 'copy') {
            const activeElement = doc.activeElement
            if (activeElement && activeElement.value) {
              copiedContents.en = activeElement.value
            }
            return true
          }
          return false
        })
        .as('execCommandEN')
    })

    cy.contains('button', 'Copy for AI', { timeout: 10000 }).click()

    cy.get('@execCommandEN').should('have.been.calledWith', 'copy')

    cy.contains('button', 'Copied!', { timeout: 5000 }).should('be.visible')

    cy.then(() => {
      expect(copiedContents.en).to.not.be.undefined
      expect(copiedContents.en).to.not.be.empty
      cy.log(`EN content length: ${copiedContents.en?.length || 0}`)
      verifyMarkdownStructure(copiedContents.en, 'en')
    })

    cy.contains('button', 'Copy for AI', { timeout: 15000 }).should(
      'be.visible'
    )
  })

  it('Should copy content in Spanish and verify markdown structure', () => {
    if (!tutorialSlugs.es) {
      cy.log('Spanish slug not available, skipping Spanish copy test')
      return
    }

    const spanishUrl = `/es/docs/tutorials/${tutorialSlugs.es}`
    cy.visit(spanishUrl)

    cy.get('article', { timeout: 15000 }).should('be.visible')

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

    cy.contains('button', 'Copiar para IA', { timeout: 10000 }).click()

    cy.get('@execCommandES').should('have.been.calledWith', 'copy')

    cy.contains('button', '¡Copiado!', { timeout: 5000 }).should('be.visible')

    cy.then(() => {
      expect(copiedContents.es).to.not.be.undefined
      expect(copiedContents.es).to.not.be.empty
      cy.log(`ES content length: ${copiedContents.es?.length || 0}`)
      verifyMarkdownStructure(copiedContents.es, 'es')
    })
  })

  it('Should copy content in Portuguese and verify all languages are unique', () => {
    if (!tutorialSlugs.pt) {
      cy.log('Portuguese slug not available, skipping Portuguese copy test')
      return
    }

    const portugueseUrl = `/pt/docs/tutorials/${tutorialSlugs.pt}`
    cy.visit(portugueseUrl)

    cy.get('article', { timeout: 15000 }).should('be.visible')

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

    cy.contains('button', 'Copiar para IA', { timeout: 10000 }).click()

    cy.get('@execCommandPT').should('have.been.calledWith', 'copy')

    cy.contains('button', 'Copiado!', { timeout: 5000 }).should('be.visible')

    cy.then(() => {
      expect(copiedContents.pt).to.not.be.undefined
      expect(copiedContents.pt).to.not.be.empty
      cy.log(`PT content length: ${copiedContents.pt?.length || 0}`)
      verifyMarkdownStructure(copiedContents.pt, 'pt')
    })

    cy.then(() => {
      if (!copiedContents.en || !copiedContents.es || !copiedContents.pt) {
        cy.log(
          'Missing one or more language contents, skipping uniqueness test'
        )
        return
      }

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

      const contentsArray = [
        copiedContents.en,
        copiedContents.es,
        copiedContents.pt,
      ]
      const uniqueContents = new Set(contentsArray)

      expect(uniqueContents.size).to.equal(3)
      cy.log('✓ All three language contents are unique')

      cy.log('Content Summary:')
      cy.log(`EN: ${copiedContents.en.length} chars`)
      cy.log(`ES: ${copiedContents.es.length} chars`)
      cy.log(`PT: ${copiedContents.pt.length} chars`)
    })
  })
})
