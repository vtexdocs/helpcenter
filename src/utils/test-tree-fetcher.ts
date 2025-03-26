/// <reference types="cypress" />
import { getGithubTree, GithubTreeResponse } from './github-utils'

/**
 * Test utility for validating the GitHub tree fetcher implementation
 */
export async function testTreeFetcher(
  owner: string,
  repo: string,
  ref = 'main'
): Promise<GithubTreeResponse> {
  try {
    console.log(`Testing tree fetch for ${owner}/${repo}@${ref}...`)
    const result = await getGithubTree(owner, repo, ref, 'test')
    console.log(`Successfully fetched ${result.tree.length} tree entries`)
    return result
  } catch (error) {
    console.error('Tree fetcher test failed:', error)
    throw error
  }
}

type TestSuccess = {
  success: true
  itemCount: number
  fetchTimeMs: number
}

type TestFailure = {
  success: false
  error: string
}

type TestResult = TestSuccess | TestFailure

// Export a function that can be called from Cypress tests
export function validateTreeFetcher(
  cy: Cypress.Chainable
): Cypress.Chainable<TestResult> {
  return cy.then(() =>
    testTreeFetcher('vtex', 'helpcenter', 'main')
      .then(
        (result): TestSuccess => ({
          success: true,
          itemCount: result?.tree?.length || 0,
          fetchTimeMs: 0, // We don't track time in tests
        })
      )
      .catch(
        (error): TestFailure => ({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      )
  )
}
