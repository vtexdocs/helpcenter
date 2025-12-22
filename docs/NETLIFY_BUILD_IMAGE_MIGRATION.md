# Netlify Build Image Migration Log

## Issue Reference

- **GitHub Issue**: [#327 - Update Netlify build image selection](https://github.com/vtexdocs/helpcenter/issues/327)
- **Jira Task**: [EDU-16245](https://vtex-dev.atlassian.net/browse/EDU-16245)

## Migration Summary

| Field | Value |
|-------|-------|
| **Migration Date** | December 22, 2025 |
| **Previous Build Image** | Ubuntu Focal 20.04 |
| **New Build Image** | Ubuntu Noble (24.04) |
| **Deadline** | January 1, 2026 (Netlify deprecation date) |

## Background

Netlify is deprecating older build images starting January 1, 2026. The helpcenter portal must migrate to a newer build image to ensure continued functionality.

## Build Image Analysis

### Available Options

As of December 2025, **Netlify only offers Ubuntu Noble 24.04**. Previous images (Focal 20.04, Jammy 22.04) have been deprecated and are no longer available for selection.

| Build Image | Ubuntu Version | Status |
|-------------|----------------|--------|
| Ubuntu Focal | 20.04 | Deprecated (our current, being phased out) |
| Ubuntu Noble | 24.04 | **Only available option** |

### Ubuntu Noble 24.04 Benefits

- Latest LTS with support until ~2029
- Updated toolchain: Node.js LTS, Python 3.13, libvips 8.15.1
- Best security posture with latest patches
- Netlify's only supported image going forward

### Migration Considerations

Since this is a mandatory upgrade from Focal to Noble (skipping Jammy entirely), we must verify:
- Native module compilation (`sharp` with libvips)
- Edge function compatibility (Deno runtime)
- Shell script behavior differences (`base64` command)

### Critical Components

The following components require validation after migration:

1. **sharp** - Native image optimization library (configured in `netlify.toml`)
2. **Edge Functions** - Deno-based redirect handler (`netlify/edge-functions/redirect-from-old-portal.js`)
3. **Node.js 20** - Already configured in `netlify.toml`
4. **getPEM.sh** - Shell script using `base64` command

## Pre-Migration Checklist

- [x] Document current build image version (Ubuntu Focal 20.04)
- [x] Changed build image to Ubuntu Noble 24.04 in Netlify UI
- [x] Create test branch for deploy preview ([PR #399](https://github.com/vtexdocs/helpcenter/pull/399))
- [x] Verify build completes successfully
- [x] Test redirect edge functions (manual verification)
- [x] Verify image optimization (sharp) - `/_next/image` endpoints working
- [ ] Run E2E tests on deploy preview (GitHub Actions)
- [ ] Update production build image
- [ ] Verify production deployment

## Testing Results

### Build Validation

| Check | Status | Notes |
|-------|--------|-------|
| Native modules (sharp) | ✅ Pass | Compiled successfully on Noble |
| Edge functions deployment | ✅ Pass | Deployed without errors |
| Node.js/Yarn versions | ✅ Pass | Compatible with Noble |
| Build completion | ✅ Pass | [Deploy Preview](https://deploy-preview-399--leafy-mooncake-7c2e5e.netlify.app) |

### Functional Testing

#### E2E Tests (Cypress)

| Test Suite | Status | Notes |
|------------|--------|-------|
| Navigation status test | ⏳ Waiting | GitHub Actions will run automatically |
| Copy for LLM test | ⏳ Waiting | GitHub Actions will run automatically |

#### Redirect Testing

| Test URL | Expected Destination | Status |
|----------|---------------------|--------|
| `/tutorial/creating-multi-store-multi-domain` | `/en/docs/tutorials/managing-a-multistore` | ✅ Pass |
| `/faq` | `/faq` (listing page) | ✅ Pass |
| `/known-issues` | `/known-issues` (listing page) | ✅ Pass |
| `/announcements` | `/announcements` (listing page) | ✅ Pass |

#### Image Optimization

| Check | Status | Notes |
|-------|--------|-------|
| next/image responses | ✅ Pass | `/_next/image?url=...&w=1200&q=75` returns 200 |
| Static images | ✅ Pass | `/images/known-issues.png` returns 200 |

#### General Navigation

| Check | Status | Notes |
|-------|--------|-------|
| Homepage loads | ✅ Pass | All sections visible |
| Navigation dropdown | ✅ Pass | Menu items accessible |
| API navigation | ✅ Pass | `/api/navigation` returns 200 |

## Issues Encountered

_No issues encountered yet._

## Rollback Instructions

If issues arise after production migration:

1. Open Netlify dashboard for the helpcenter site
2. Navigate to: `Project configuration > Build & deploy > Continuous deployment > Build image selection`
3. Select the previous build image (documented above)
4. Trigger a new deploy
5. Verify site functionality is restored

## Change Log

| Date | Action | Performed By |
|------|--------|--------------|
| 2025-12-22 | Created migration document | Pedro Costa |
| 2025-12-22 | Verified current build image: Ubuntu Focal 20.04 | Pedro Costa |
| _TBD_ | Tested on deploy preview | _TBD_ |
| _TBD_ | Updated production build image | _TBD_ |

