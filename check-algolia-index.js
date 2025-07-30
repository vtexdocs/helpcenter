#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const algoliasearch = require('algoliasearch')
require('dotenv').config({ path: '.env.local' })
/* eslint-enable @typescript-eslint/no-var-requires */

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_WRITE_KEY

if (!APP_ID || !API_KEY) {
  console.log('❌ Missing Algolia credentials in .env.local')
  console.log(
    '💡 Add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_WRITE_KEY'
  )
  process.exit(1)
}

const client = algoliasearch(APP_ID, API_KEY)
const index = client.initIndex('helpcenter-docs')

async function checkIndex() {
  try {
    console.log('🔍 Checking current Algolia index...\n')

    // Get index statistics
    const stats = await index.getSettings()
    console.log('📊 Index Settings:')
    console.log('  attributesToRetrieve:', stats.attributesToRetrieve)
    console.log('  attributesForFaceting:', stats.attributesForFaceting)
    console.log('')

    // Search for a few sample records
    const searchResult = await index.search('', {
      hitsPerPage: 3,
      attributesToRetrieve: [
        'hierarchy',
        'content',
        'url',
        'indexed_at',
        'indexed_timestamp',
        'objectID',
      ],
    })

    console.log(`📋 Sample Records (${searchResult.nbHits} total records):\n`)

    searchResult.hits.forEach((hit, i) => {
      console.log(`Record ${i + 1}:`)
      console.log(`  ObjectID: ${hit.objectID}`)
      console.log(`  URL: ${hit.url}`)
      console.log(`  Title: ${hit.hierarchy?.lvl0 || 'No title'}`)
      console.log(
        `  Content preview: ${(hit.content || '').substring(0, 100)}...`
      )

      if (hit.indexed_at || hit.indexed_timestamp) {
        console.log('  ✅ HAS TIMESTAMPS:')
        console.log(`    indexed_at: ${hit.indexed_at}`)
        console.log(`    indexed_timestamp: ${hit.indexed_timestamp}`)
        if (hit.indexed_timestamp) {
          const date = new Date(hit.indexed_timestamp * 1000)
          console.log(`    timestamp as date: ${date.toISOString()}`)
        }
      } else {
        console.log('  ❌ NO TIMESTAMPS (not yet indexed with new feature)')
      }
      console.log('')
    })

    // Check if any records have timestamps
    const timestampSearch = await index.search('', {
      hitsPerPage: 1,
      filters: 'indexed_timestamp > 0',
    })

    if (timestampSearch.nbHits > 0) {
      console.log(`✅ Found ${timestampSearch.nbHits} records with timestamps!`)
      console.log('🎉 Timestamp tracking is working!')
    } else {
      console.log('❌ No records with timestamps found')
      console.log('💡 Run "yarn index" to add timestamps to all records')
    }
  } catch (error) {
    console.error('❌ Error checking index:', error.message)
    if (error.status === 403) {
      console.log('💡 Check your Algolia API key permissions')
    }
  }
}

// Add a search test function
async function testSearch() {
  try {
    console.log('\n🔍 Testing search functionality...')

    const searchResult = await index.search('account', {
      hitsPerPage: 2,
      attributesToRetrieve: ['hierarchy', 'indexed_at', 'indexed_timestamp'],
    })

    console.log(`Found ${searchResult.nbHits} results for "account"`)
    searchResult.hits.forEach((hit, i) => {
      console.log(`  ${i + 1}. ${hit.hierarchy?.lvl0 || 'No title'}`)
      if (hit.indexed_at) {
        console.log(`     📅 Indexed: ${hit.indexed_at}`)
      }
    })
  } catch (error) {
    console.error('❌ Search test failed:', error.message)
  }
}

// Main execution
async function main() {
  await checkIndex()
  await testSearch()
}

main()
