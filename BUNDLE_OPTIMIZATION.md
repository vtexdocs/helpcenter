# VTEX Helpcenter Bundle Size Analysis & Optimization Guide

## 📊 Current Bundle Size Overview

Based on the analysis performed, here are the key findings:

### Core Bundle Sizes
- **App Bundle**: 3.79 MB (⚠️ **CRITICAL** - Very large)
- **Framework Bundle**: 137.75 KB (✅ Normal)
- **Main Bundle**: 87.88 KB (✅ Good)
- **Webpack Runtime**: 4.45 KB (✅ Good)

### Large Chunks (>100KB)
1. `_app-*.js`: 3.79 MB (Main app bundle)
2. `72fdc299.*.js`: 1.31 MB (Vendor chunks)
3. `d488728f.*.js`: 349.49 KB (Additional chunks)

### Page Data Issues
- **Tutorial pages**: ~1.6MB average static data per page
- **Track pages**: ~1.6MB average static data per page  
- **FAQ pages**: ~1.6MB average static data per page

## 🔍 Bundle Analysis Commands

```bash
# Generate bundle analysis reports
yarn analyze

# View detailed bundle report
yarn bundle-report

# Open interactive bundle analyzer
open .next/analyze/client.html
```

## ⚠️ Critical Issues Identified

### 1. Massive App Bundle (3.79MB)
The `_app.js` bundle is extremely large, likely containing:
- All imported libraries and components
- MDX processing libraries
- UI component libraries
- Admin/editor components loaded on every page

### 2. Large Page Data (1.6MB per page)
Each tutorial/track page loads 1.6MB of static data, indicating:
- Large navigation objects being passed to every page
- Heavy metadata objects
- Possibly entire content trees being loaded statically

## 🚀 Optimization Strategies

### 1. App Bundle Splitting

```javascript
// next.config.js - Add webpack optimization
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 200000, // 200KB max per chunk
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            maxSize: 100000, // 100KB max
          },
          mdx: {
            test: /[\\/]node_modules[\\/](@mdx-js|next-mdx-remote|remark|rehype)/,
            name: 'mdx',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@vtex\/brand-ui|@vtexdocs\/components)/,
            name: 'ui',
            chunks: 'all',
          }
        }
      }
    }
    return config
  }
}
```

### 2. Dynamic Imports for Heavy Components

```typescript
// Example: Lazy load editor components
import { lazy, Suspense } from 'react'

const EditorComponent = lazy(() => import('../components/editor'))
const RapidocComponent = lazy(() => import('../components/rapidoc'))

// Use with Suspense
function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorComponent />
    </Suspense>
  )
}
```

### 3. Page Data Optimization

```typescript
// Instead of passing entire navigation to every page
export async function getStaticProps({ params }) {
  // ❌ Don't do this
  const allNavigation = await getFullNavigation() // 1.6MB
  
  // ✅ Do this instead
  const pageNavigation = await getPageSpecificNavigation(params.slug) // ~50KB
  const breadcrumbs = await getBreadcrumbs(params.slug) // ~5KB
  
  return {
    props: {
      pageNavigation,
      breadcrumbs,
      // Only essential data for this specific page
    }
  }
}
```

### 4. Implement Incremental Static Regeneration (ISR)

```typescript
export async function getStaticProps({ params }) {
  return {
    props: {
      // page data
    },
    revalidate: 3600, // Regenerate every hour
  }
}
```

### 5. Client-Side Navigation Data Loading

```typescript
// Load navigation data on demand
import useSWR from 'swr'

function Navigation() {
  const { data: navData } = useSWR('/api/navigation', fetcher)
  
  return <NavigationComponent data={navData} />
}
```

## 📈 Monitoring & Continuous Optimization

### 1. Add Bundle Size Limits

```json
// package.json
{
  "scripts": {
    "build:check-size": "yarn build && bundlesize"
  }
}
```

### 2. CI/CD Bundle Size Monitoring

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check
on: [pull_request]
jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: yarn install
      - name: Build and analyze
        run: yarn analyze
      - name: Check bundle size
        run: yarn bundle-report
```

### 3. Core Web Vitals Monitoring

Set up monitoring for:
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms  
- **CLS (Cumulative Layout Shift)**: Target < 0.1

## 🎯 Quick Wins (Immediate Actions)

### 1. Dynamic Import Heavy Libraries
```typescript
// Instead of global imports
import { RapidocComponent } from 'rapidoc'

// Use dynamic imports
const RapidocComponent = dynamic(() => import('rapidoc'), {
  ssr: false,
  loading: () => <p>Loading API docs...</p>
})
```

### 2. Split Large Components
```typescript
// Split editor functionality
const AdminEditor = dynamic(() => import('./admin-editor'), { ssr: false })
const ContentEditor = dynamic(() => import('./content-editor'), { ssr: false })
```

### 3. Optimize Navigation Data
```typescript
// Create API endpoint for navigation
// pages/api/navigation/[...slug].ts
export default function handler(req, res) {
  const { slug } = req.query
  const navData = getNavigationForSlug(slug)
  res.json(navData)
}
```

## 📋 Implementation Checklist

- [ ] Implement webpack bundle splitting configuration
- [ ] Add dynamic imports for editor components  
- [ ] Create API endpoints for navigation data
- [ ] Implement ISR for content pages
- [ ] Set up bundle size monitoring in CI/CD
- [ ] Add bundle size limits and alerts
- [ ] Optimize image loading and sizes
- [ ] Review and remove unused dependencies
- [ ] Implement virtual scrolling for long lists
- [ ] Add performance monitoring dashboard

## 📊 Expected Results

After implementing these optimizations:

- **App Bundle**: 3.79MB → ~800KB (80% reduction)
- **Page Data**: 1.6MB → ~200KB (87% reduction)
- **Load Time**: Significant improvement in First Contentful Paint
- **User Experience**: Faster navigation and page loads

## 🔧 Development Tools

- **Bundle Analyzer**: `yarn analyze` 
- **Bundle Report**: `yarn bundle-report`
- **Performance Profiling**: Chrome DevTools Performance tab
- **Network Analysis**: Chrome DevTools Network tab

## 📚 Additional Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/advanced-features/analyzing-bundles)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#epilogue-browser-paint)
