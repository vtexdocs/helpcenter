#!/usr/bin/env ts-node
import { getGithubTree } from '../github-utils'

async function testTreeFetch() {
  try {
    const tree = await getGithubTree(
      'vtexdocs',
      'help-center-content',
      'main',
      'test-tree-fetch'
    )
    console.log('Tree fetch successful:', tree.tree.length, 'items')
  } catch (error) {
    console.error('Tree fetch failed:', error)
  }
}

testTreeFetch()
