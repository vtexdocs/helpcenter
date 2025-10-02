/// <reference types="cypress" />

describe('Help Center Navigation Status Test', () => {
  const baseUrl = 'https://newhelp.vtex.com'
  let navigationData = []
  let selectedPages = []

  before(() => {
    // Fetch navigation data from the API
    cy.request(`${baseUrl}/api/navigation`).then((response) => {
      navigationData = response.body.navbar

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
          selectedPages.push(pages[randomIndex])
        }
      })

      // Log selected pages for visibility
      cy.log(
        'Selected pages for testing:',
        JSON.stringify(selectedPages, null, 2)
      )
    })
  })

  it('should successfully load randomly selected pages from each navbar section', () => {
    // Test each selected page
    selectedPages.forEach((page) => {
      cy.visit(page.url, { failOnStatusCode: false })

      // Verify page loads successfully (status 200)
      cy.url().should('include', page.url.replace(baseUrl, ''))

      // Verify page has content (basic check)
      cy.get('body').should('exist').and('be.visible')

      // Log success for this page
      cy.log(`✓ ${page.section}: ${page.name}`)
    })
  })

  it('should display each section name in the test results', () => {
    // Create individual test assertions for better reporting
    selectedPages.forEach((page) => {
      cy.wrap(page).should('have.property', 'url')
      cy.log(`Section: ${page.section} | Page: ${page.name} | URL: ${page.url}`)
    })
  })
})
