# Hybrid Search Setup

The Help Center exposes a server-side `/api/search` endpoint that proxies queries
to the [VTEX Docs Hybrid Search API](https://github.com/vtexdocs/vtexdocs-mcp-app)
(BM25 + vector similarity, fused via Reciprocal Rank Fusion).

The endpoint runs in a Netlify Function (Next.js API route), so the upstream
API key never reaches the browser.

## API contract

`GET /api/search`

### Query parameters

| Name     | Required | Type    | Default | Notes                                          |
| -------- | -------- | ------- | ------- | ---------------------------------------------- |
| `q`      | yes      | string  | —       | Search query. Trimmed; empty values are 400.   |
| `limit`  | no       | integer | `10`    | Clamped to the range `[1, 100]`.               |
| `locale` | no       | string  | —       | e.g. `en`, `es`, `pt`. Forwarded as-is.        |

The endpoint always sends `source=help-center` to the upstream API so callers
do not need to set it.

### Response (200)

```json
{
  "query": "checkout",
  "locale": "en",
  "limit": 10,
  "total": 1,
  "results": [
    {
      "id": 123,
      "title": "Configuring checkout",
      "filePath": "docs/en/tutorials/checkout/configuring-checkout.md",
      "chunkIndex": 0,
      "repository": "vtexdocs/help-center-content",
      "content": "...",
      "snippet": "...matched snippet...",
      "score": 0.91,
      "metadata": { "locale": "en" }
    }
  ]
}
```

### Error responses

| Status | When                                                       |
| ------ | ---------------------------------------------------------- |
| 400    | Missing or empty `q`.                                      |
| 405    | Method other than `GET`.                                   |
| 401/403| Forwarded from upstream (bad/missing API key).             |
| 502    | Upstream returned a 5xx error.                             |
| 503    | `HS_API_ENDPOINT` or `HS_API_KEY` is not configured.       |
| 504    | Upstream request timed out (15s).                          |
| 500    | Unexpected server error.                                   |

### Caching

Successful responses are cached at the CDN edge for 60s with a 5-minute
stale-while-revalidate window:

```
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
Netlify-CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=300
Vary: Accept-Language
```

## Environment variables

Add the following to **Netlify → Site settings → Environment variables**.
Make sure each variable is enabled for the scopes you need (Production,
Deploy previews, Branch deploys).

| Variable                            | Scope          | Description                                                |
| ----------------------------------- | -------------- | ---------------------------------------------------------- |
| `HS_API_ENDPOINT`                   | Server         | Base URL of the Hybrid Search API, e.g. `https://vtexdocs-edge.vtex.com`. |
| `HS_API_KEY`                        | Server (secret)| Internal access key, sent as `X-Internal-Access-Key`.      |
| `NEXT_PUBLIC_HYBRID_SEARCH_ENABLED` | Public         | Set to `true` to enable hybrid search instead of Algolia.  |

## Enabling hybrid search

The Help Center uses a feature flag to switch between Algolia (default) and hybrid search.

### Local development

1. Set the following variables in `.env.local`:
   ```bash
   # Enable hybrid search (set to false or omit to use Algolia)
   NEXT_PUBLIC_HYBRID_SEARCH_ENABLED=true
   
   # Hybrid Search API configuration (server-side only)
   HS_API_ENDPOINT=https://vtexdocs-edge.vtex.com
   HS_API_KEY=<your-key-here>
   ```

2. Restart the dev server for changes to take effect:
   ```bash
   yarn dev
   ```

### Netlify deployment

Add `NEXT_PUBLIC_HYBRID_SEARCH_ENABLED=true` to Netlify environment variables to enable hybrid search in production/preview environments.

**Note:** Because this uses the `NEXT_PUBLIC_` prefix, changes require a rebuild.

## Local testing

After [enabling hybrid search](#enabling-hybrid-search):

```bash
yarn dev
# in another terminal
curl "http://localhost:3000/api/search?q=checkout&limit=5&locale=en"
```

Run the unit tests (no network required, upstream is mocked):

```bash
yarn test src/pages/api/__tests__/search.test.ts
```

The tests cover:

- 405 for non-GET methods
- 400 for missing or whitespace-only `q`
- 503 when env vars are missing
- Forwarded params (`q`, `limit`, `locale`, `source=help-center`) and headers
- Default limit (`10`) and clamping to `[1, 100]`
- 5xx upstream → 502, 4xx upstream → passthrough
- AbortError → 504, generic error → 500
- URL-encoding of special characters in `q`

## Deploy preview testing

1. Push the branch and open a PR. Netlify will build a deploy preview.
2. Confirm `HS_API_ENDPOINT` and `HS_API_KEY` are configured for the
   **Deploy previews** scope in Netlify.
3. Hit the preview endpoint:

   ```bash
   curl "https://deploy-preview-<n>--<site>.netlify.app/api/search?q=checkout"
   ```

4. Verify the response shape matches the contract above and that the
   upstream API key is not exposed in any client-side bundle.

## Related work

- Indexing pipeline: `vtexdocs/help-center-content/.github/workflows/index-documents.yml`
- Upstream OpenAPI spec: `vtexdocs/vtexdocs-mcp-app/apps/api/openapi.json`
