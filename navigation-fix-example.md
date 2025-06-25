# Navigation Props Fix

## Current Problem (Line 572)
```typescript
return {
  props: {
    sidebarfallback, // ❌ 3.4MB navigation sent to client
    parentsArray,
    breadcrumbList,
    // ...
  }
}
```

## Fixed Version
```typescript
return {
  props: {
    // ❌ Remove: sidebarfallback,
    parentsArray,
    breadcrumbList,
    pagination,
    sectionSelected,
    // Only send computed/derived data, not the full navigation
  }
}
```

## Impact
- **Before**: 3.4MB navigation + 1.6MB page content = ~5MB per page
- **After**: Just computed data (~50KB) + 1.6MB page content = ~1.65MB per page
- **Savings**: ~70% reduction in page data size
