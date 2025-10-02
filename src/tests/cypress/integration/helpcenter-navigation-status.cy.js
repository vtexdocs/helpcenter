/// <reference types="cypress" />

describe('Help Center Navigation Status Test', () => {
  const baseUrl = 'https://newhelp.vtex.com'
  let selectedPages = []

  before(() => {
    // Fetch navigation data from the API
    cy.request(`${baseUrl}/api/navigation`).then((response) => {
      const navigationData = response.body.navbar

      cy.task('log', '\n' + '='.repeat(80))
      cy.task('log', '📋 HELP CENTER NAVIGATION TEST')
      cy.task('log', '='.repeat(80))
      cy.task('log', `Fetching navigation from: ${baseUrl}/api/navigation`)
      cy.task('log', `Found ${navigationData.length} navbar sections\n`)

      // Select one random page from each navbar section
      navigationData.forEach((section) => {
        const { documentation, categories } = section

        // Collect all markdown pages from this section
        const pages = []
        const collectPages = (items, prefix = '') => {
          items.forEach((item) => {
            if (item.type === 'markdown' && item.slug) {
              // Handle localized slugs (use English)
              const slug =
                typeof item.slug === 'object' ? item.slug.en : item.slug
              const name =
                typeof item.name === 'object' ? item.name.en : item.name
              pages.push({
                url: `${baseUrl}/${prefix}${slug}`,
                name,
                section: documentation,
              })
            }
            if (item.children && item.children.length > 0) {
              collectPages(item.children, prefix)
            }
          })
        }

        // Determine the URL prefix for this section
        const urlPrefix = section.slugPrefix.endsWith('/')
          ? section.slugPrefix.slice(0, -1) + '/'
          : section.slugPrefix + '/'

        collectPages(categories, urlPrefix)

        // Select a random page from this section
        if (pages.length > 0) {
          const randomIndex = Math.floor(Math.random() * pages.length)
          const selectedPage = pages[randomIndex]
          selectedPages.push(selectedPage)
          cy.task(
            'log',
            `  ✓ ${documentation.padEnd(20)} → "${selectedPage.name}"`
          )
        }
      })

      cy.task('log', `\n🎯 Selected ${selectedPages.length} pages for testing`)
      cy.task('log', '='.repeat(80) + '\n')
    })
  })

  it('should successfully load randomly selected pages from each navbar section', () => {
    cy.task('log', '\n🧪 Starting page tests...\n')

    // Test each selected page
    selectedPages.forEach((page, index) => {
      cy.task(
        'log',
        `[${index + 1}/${selectedPages.length}] Testing: ${page.section}`
      )
      cy.task('log', `    Page: "${page.name}"`)
      cy.task('log', `    URL: ${page.url}`)

      cy.visit(page.url, { failOnStatusCode: false })

      // Verify page loads successfully
      cy.url().should('include', page.url.replace(baseUrl, ''))

      // Verify page has basic structure
      cy.get('body').should('exist').and('be.visible')

      // Verify article content exists and contains rendered markdown
      cy.get('article').should('exist').and('be.visible')

      // Check that article has actual content (headings, paragraphs, etc.)
      cy.get('article').within(() => {
        // Should have either headings, paragraphs, or lists (typical markdown elements)
        cy.get('h1, h2, h3, h4, p, ul, ol, pre, code').should('exist')
      })

      cy.task('log', `    ✓ Page loaded with rendered markdown content\n`)
    })

    // Final summary
    cy.task('log', '\n' + '='.repeat(80))
    cy.task('log', `✅ All ${selectedPages.length} pages tested successfully!`)
    cy.task('log', '='.repeat(80) + '\n')
  })
})
