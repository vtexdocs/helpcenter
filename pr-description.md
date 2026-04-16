#### What is the purpose of this pull request?

Centralize and standardize how the application loads `navigation.json` so both
build-time and runtime read from the same external source:
`vtexdocs/help-center-content/public/navigation.json`.

This PR:
- Points the default navigation source to the help-center-content repo via an env var.
- Adds an API route to serve navigation with caching and filesystem fallback.
- Unifies client and server usage to reduce duplication and simplify maintenance.

#### What problem is this solving?

Previously, navigation could come from different places:
- Local `public/navigation.json` during build.
- A hardcoded URL (`help.vtex.com/navigation.json`) or other sources at runtime.
- Client-side code sometimes dynamically imported the local JSON.

This led to divergence between build and runtime sources and risked bundling a
large JSON in client code. We want a single, authoritative source:
`vtexdocs/help-center-content/public/navigation.json`.

#### What has changed?

- next.config.js
  - Set `env.navigationJsonUrl` default to:
    `https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json`.

- src/pages/api/navigation.ts (new)
  - New API route that fetches from `process.env.navigationJsonUrl` first.
  - Falls back to local `public/navigation.json` if the fetch fails.
  - Sets `Cache-Control` and `Netlify-CDN-Cache-Control` to
    `public, s-maxage=600, stale-while-revalidate=59`.

- src/utils/getNavigation.ts
  - Now prefers `process.env.navigationJsonUrl` (help-center-content) at build/SSR.
  - Falls back to local `public/navigation.json`.
  - Final fallback to the same raw GitHub URL.

- src/utils/useClientNavigation.ts
  - Client now fetches `/api/navigation` instead of importing the local file.
  - This keeps client and server in sync and avoids bundling the large JSON.

- Formatting fixes (Prettier/ESLint) in touched files.

#### How should this be manually tested?

1) Development server
- Run `yarn dev`.
- Visit `http://localhost:3000` and verify pages load the sidebar.
- Verify the API:
  - `curl http://localhost:3000/api/navigation` returns the JSON and includes
    the `navbar` array from help-center-content.

2) Production build
- Run `yarn build`.
- Confirm build finishes successfully and `next-sitemap` generation completes.

3) Env override (optional)
- Set `navigationJsonUrl` in the environment to point to a different branch or
  location if needed. The API and server-side utility will use it.

4) Failure fallback (optional)
- Temporarily set an invalid `navigationJsonUrl` and confirm the app falls back
  to `public/navigation.json`.

#### Screenshots or example usage

N/A (functional change). You can verify by checking the `/api/navigation` JSON.

#### Types of changes

- [x] New feature (non-breaking change which adds functionality)
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Requires change to documentation, which has been updated accordingly
