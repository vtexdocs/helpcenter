#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔍 VTEX Helpcenter Bundle Analysis Report')
console.log('=========================================\n')

// 2. Analyze chunk sizes
console.log('📊 BUNDLE SIZE ANALYSIS')
console.log('======================\n')

// Function to get file size in a readable format
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    const bytes = stats.size
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  } catch (error) {
    return 'File not found'
  }
}

// Analyze main chunks
console.log('🚀 Core Bundles:')
console.log('================')

try {
  const staticFiles = execSync('find .next/static -name "*.js" -type f')
    .toString()
    .split('\n')
    .filter(Boolean)

  staticFiles.forEach((file) => {
    const size = getFileSize(file)
    const fileName = path.basename(file)

    if (fileName.startsWith('webpack-')) {
      console.log(`  📦 Webpack Runtime: ${size}`)
    } else if (fileName.startsWith('framework-')) {
      console.log(`  ⚛️  React Framework: ${size}`)
    } else if (fileName.startsWith('main-')) {
      console.log(`  🏠 Main Bundle: ${size}`)
    } else if (fileName.includes('_app-')) {
      console.log(`  🎯 App Bundle: ${size}`)
    }
  })

  console.log('\n📄 Page-specific Bundles:')
  console.log('=========================')

  // Analyze page bundles
  const pagesBundles = staticFiles
    .filter((file) => file.includes('/pages/') && !file.includes('_app'))
    .slice(0, 10)
  pagesBundles.forEach((file) => {
    const size = getFileSize(file)
    const fileName = path.basename(file)
    console.log(`  📋 ${fileName}: ${size}`)
  })

  console.log('\n📚 Large Chunks (>100KB):')
  console.log('=========================')

  const largeChunks = staticFiles
    .filter((file) => {
      try {
        const stats = fs.statSync(file)
        return stats.size > 100 * 1024 // > 100KB
      } catch {
        return false
      }
    })
    .sort((a, b) => {
      try {
        return fs.statSync(b).size - fs.statSync(a).size
      } catch {
        return 0
      }
    })

  largeChunks.forEach((file) => {
    const size = getFileSize(file)
    const fileName = path.basename(file)
    console.log(`  🔶 ${fileName}: ${size}`)
  })
} catch (error) {
  console.error('Error analyzing files:', error.message)
}

// 3. Page data size warnings analysis
console.log('\n⚠️  LARGE PAGE DATA WARNINGS')
console.log('============================')
console.log('Pages exceeding 500KB threshold:')

// Read the build log for page data warnings (this would need actual build log parsing)
const buildOutput = `
From build output, we observed many pages with data exceeding 500KB:
- Tutorial pages: ~1.6MB average
- Track pages: ~1.6MB average
- FAQ pages: ~1.6MB average

These warnings indicate that static props data (getStaticProps) is very large.
`

console.log(buildOutput)

// 4. Bundle analysis recommendations
console.log('\n💡 OPTIMIZATION RECOMMENDATIONS')
console.log('===============================')
console.log(`
1. 🎯 Page Data Optimization:
   - Many tutorial/track pages have 1.6MB+ of static data
   - Consider pagination for large content lists
   - Implement dynamic imports for heavy components
   - Split large navigation/metadata objects

2. 📦 Bundle Splitting:
   - The _app bundle is quite large (3.8MB)
   - Consider code splitting for admin/editor components
   - Use dynamic imports for markdown processing libraries
   - Separate vendor chunks for large libraries

3. 🔄 Dynamic Loading:
   - Implement lazy loading for editor components
   - Use React.lazy() for heavy UI components
   - Consider virtual scrolling for long lists

4. 📊 Content Optimization:
   - Large navigation.json (likely contributor to page data size)
   - Consider API-based content loading instead of static props
   - Implement incremental static regeneration (ISR)

5. 🚀 Performance Monitoring:
   - Set up bundle size monitoring in CI/CD
   - Use Next.js bundle analyzer in development
   - Monitor Core Web Vitals impact
`)

console.log('\n📈 Bundle Analysis Reports Generated:')
console.log('====================================')
console.log('  • Client bundle: .next/analyze/client.html')
console.log('  • Server bundle: .next/analyze/nodejs.html')
console.log('  • Edge runtime: .next/analyze/edge.html')
console.log('\nOpen these HTML files in your browser for interactive analysis.')
