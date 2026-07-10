// Forces yarn to re-fetch the pinned @vtexdocs/components git dependency instead
// of reusing a stale build restored from Netlify's dependency cache. Netlify keeps
// node_modules across builds, so a moving/rebuilt git dep at a new commit can be
// masked by the cached tree; removing it before install guarantees a clean fetch.
import { rmSync } from 'node:fs'

const target = 'node_modules/@vtexdocs/components'

try {
  rmSync(target, { recursive: true, force: true })
} catch (err) {
  // Non-fatal: a failure here should not block install (folder may be absent).
  console.warn(`purge-components-cache: could not remove ${target}:`, err?.message)
}
