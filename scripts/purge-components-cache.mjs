// Forces yarn to re-fetch the pinned @vtexdocs/components git dependency instead
// of reusing a stale build restored from Netlify's dependency cache. Netlify keeps
// node_modules across builds, so a moving/rebuilt git dep at a new commit can be
// masked by the cached tree.
//
// Removing the package folder alone is not enough: yarn 1 decides whether to
// install from node_modules/.yarn-integrity, so it would skip re-linking the
// deleted package and the build would fail with "Cannot find module". Removing
// the integrity file too forces a real install pass that restores the package at
// the SHA pinned in yarn.lock.
import { rmSync } from 'node:fs'

const targets = [
  'node_modules/@vtexdocs/components',
  'node_modules/.yarn-integrity',
]

for (const target of targets) {
  try {
    rmSync(target, { recursive: true, force: true })
  } catch (err) {
    // Non-fatal: a failure here should not block install (path may be absent).
    console.warn(`purge-components-cache: could not remove ${target}:`, err?.message)
  }
}
