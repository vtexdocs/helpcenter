# Netlify Build Image Migration Log

## Issue Reference

- **GitHub Issue**: [#327 - Update Netlify build image selection](https://github.com/vtexdocs/helpcenter/issues/327)
- **Jira Task**: [EDU-16245](https://vtex-dev.atlassian.net/browse/EDU-16245)
- **Where to change the build image:** [Project configuration > Continuous deployment](https://app.netlify.com/projects/leafy-mooncake-7c2e5e/configuration/deploys#continuous-deployment)

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
| `/tutorial/creating-multi-store-multi-domain` | `/en/docs/tutorials/managing-a-multistore` | ⚠️ Redirect works, destination 500 |
| `/faq` | `/faq` (listing page) | ✅ Pass |
| `/known-issues` | `/known-issues` (listing page) | ✅ Pass |
| `/announcements` | `/announcements` (listing page) | ✅ Pass |

#### Tutorial Pages (CRITICAL ISSUE)

| Test URL | Production | Deploy Preview |
|----------|------------|----------------|
| `/pt/docs/tutorials/criar-autenticacao-oauth2` | ✅ Works | ❌ 500 Error |
| `/pt/docs/tutorials/assinaturas-categoria` | ✅ Works | ❌ 500 Error |
| `/en/docs/tutorials/managing-a-multistore` | ✅ Works | ❌ 500 Error |

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

### CRITICAL: 500 Errors on Tutorial Pages

**Status:** Under Investigation

**Symptoms:**
- Tutorial article pages return 500 errors on deploy preview
- Same pages work correctly on production (Ubuntu Focal)
- Affects both individual tutorials and category/subcategory pages

**Affected URLs (examples):**
- `/pt/docs/tutorials/criar-autenticacao-oauth2` - 500 on preview, works on prod
- `/pt/docs/tutorials/assinaturas-categoria` - 500 on preview
- `/pt/docs/tutorials/conversational-commerce-categoria` - 500 on preview
- `/en/docs/tutorials/managing-a-multistore` - 500 on preview

**Working pages:**
- Homepage (`/`) - ✅
- FAQ listing (`/faq`) - ✅
- Known Issues listing (`/known-issues`) - ✅
- Announcements listing (`/announcements`) - ✅

**Build Log Analysis:**

Compared test build (Noble) vs control build (Focal production):

| Aspect | Control (Focal) | Test (Noble) |
|--------|-----------------|--------------|
| Node.js version | v20.19.6 | v20.19.6 |
| Next.js Runtime | v5.14.4 | v5.14.4 |
| Plugin warning | Same "outdated" warning | Same "outdated" warning |
| MDX errors | ~230 | ~223 |
| Build result | ✅ Success | ✅ Success |
| Runtime | ✅ Works | ❌ 500 errors |

**Key Finding:** The "outdated plugin" warning appears in BOTH builds, including production which works fine. This is NOT the root cause.

**Root Cause: IDENTIFIED ✅**

The Netlify Function Logs revealed the exact error:

```
ERROR: Something went wrong installing the "sharp" module
libvips-cpp.so.42: cannot open shared object file: No such file or directory
```

**Analysis:**
- `sharp` is a native Node.js module that depends on `libvips` C++ library
- Current version `^0.31.2` (from 2022) doesn't include prebuilt binaries for Ubuntu Noble 24.04
- Noble uses `libvips 8.15.x` but the old sharp expects `libvips-cpp.so.42` (from Focal)
- The serverless function fails at runtime because the native binary is incompatible

**Evidence:**
- Test function logs: Multiple `libvips-cpp.so.42: cannot open shared object file` errors
- Control function logs: No sharp-related errors

**Solution:**

Update `sharp` in `package.json` from `^0.31.2` → `^0.33.5`:

```bash
yarn upgrade sharp@^0.33.5
```

Sharp 0.33.x includes prebuilt binaries for Ubuntu Noble 24.04 with libvips 8.15.x.

**Reference Logs:**
- `docs/netlify build image migration/test function logs pr399.txt` - Shows sharp errors
- `docs/netlify build image migration/control function logs production.txt` - No errors

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
| 2025-12-22 | Changed build image to Ubuntu Noble 24.04 in Netlify UI | Pedro Costa |
| 2025-12-22 | Created test PR #399 and deploy preview | Pedro Costa |
| 2025-12-22 | **BLOCKER FOUND**: Tutorial pages return 500 errors | Pedro Costa |
| 2025-12-23 | Compared build logs: plugin warning is NOT root cause (same in both) | Pedro Costa |
| 2025-12-23 | Identified as runtime error; need Netlify Function Logs | Pedro Costa |
| 2025-12-23 | **ROOT CAUSE FOUND**: `sharp` module incompatible with Noble (libvips mismatch) | Pedro Costa |
| _TBD_ | Upgrade sharp ^0.31.2 → ^0.33.5 | _TBD_ |
| _TBD_ | Re-test after fix | _TBD_ |
| _TBD_ | Merge PR to deploy to production | _TBD_ |

