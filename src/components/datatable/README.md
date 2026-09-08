# DataTable

The `DataTable` renders interactive tables in Help Center articles. It provides search, sorting, pagination, and per-column filters.

The first part of this README describes the component from a technical perspective. The second part covers instructions for authors who use the tag in articles.

## What the component does

The `<DataTable>` tag in article markdown becomes a table in the Help Center. Each column can have a type (`text`, `link`, `boolean`, `country`, `date`, `number`, `currency`, `badge`, `code`, among others), which defines how the value is displayed (plain text, link, country flag, colored tag, etc.).

## How it works

The component separates data and configuration:

| Part | Location | Role |
| --- | --- | --- |
| Data | JSON file in [`help-center-content`](https://github.com/vtexdocs/help-center-content) | Table rows (`rows`). |
| Configuration | `<DataTable>` tag in the article (`.md`) | `src` points to the JSON; `columns` defines labels, types, sorting, and filters. |

High-level flow:

1. In the documentation file, you declare `<DataTable src="..." columns={[...]} />`.
2. During markdown serialization, the Help Center reads `src`, fetches the JSON from the same `help-center-content` branch, and injects the data into the page context.
3. The component builds the table with that data and applies search, sorting, filters, and pagination on the client.

Without a JSON file matching `src`, the table shows an unavailable state.

## Architecture

```
MDX (<DataTable src="…" columns={[…]} />)
  └─ serializeWithFallback
       └─ getDataTablesData → fetch JSON from help-center-content
            └─ scope.dataTablesData
                 └─ article-render
                      └─ DataTablesProvider
                           └─ DataTable (useDataTable(src))
```

| File | Role |
| --- | --- |
| `index.tsx` | UI, cell types, DataTables, filters. |
| `context.tsx` | `DataTablesProvider` + `useDataTable(src)`. |
| `datatable.types.ts` | Public types. |
| `styles.ts` | Theme UI / Brand UI styles. |
| `utils/getDataTablesData.ts` | Extracts `src` from MDX and loads the JSON files. |

- DataTables CSS is imported in `_app.tsx`.
- UI strings live in `src/messages/*.json`, under the `datatable.*` prefix.

## Reference

### Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `src` | `string` | Yes | Path to the JSON file in `help-center-content`. |
| `columns` | `DataTableColumn[]` | Yes | Column definitions. Without columns, the table is not rendered. |

#### `DataTableColumn`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | — | Field name in each JSON row. |
| `label` | `string` | Humanized from `key` | Column header title. |
| `type` | `DataTableColumnType` | `'text'` | Cell render type. |
| `sortable` | `boolean` | `false` | Enables sorting on the column. |
| `filterable` | `boolean` | `false` | Enables a filter control (dropdown or date picker). |
| `currency` | `string` | `'USD'` | ISO 4217 code for `type: 'currency'`. Invalid codes fall back to plain number formatting. |
| `badgeColors` | `Record<string, TagColor>` | — | Value → color map for `badge` / `tag`. |

### Column types

| `type` | Expected JSON value | Rendered as |
| --- | --- | --- |
| `text` | string / number | Plain text. |
| `link` | URL (`https://…`) or `[label](https://…)` | External link. Only `http` / `https`. |
| `boolean` | `true` / `false` | ✅ / ❌. |
| `country` | ISO 3166-1 alpha-2 (`BR`, `US`, …) | Flag + country name in the locale. |
| `code` | string | Monospaced `<code>`. |
| `date` | Value parseable by `Date` | Localized date; invalid values appear as raw text. |
| `number` | number | Localized number (`Intl`). |
| `currency` | number | Currency (`currency` or `USD`). |
| `badge` / `tag` | string | Colored `Tag` (`badgeColors` or a stable hash of the value). |

Valid colors for `badgeColors`: `Blue`, `Green`, `Gray`, `Scheduled`, `Deprecation`, `Closed`, `No_Fix`.

### JSON formats

#### Simple format (`rows`)

```json
{
  "updatedAt": "2026-06-01",
  "rows": [
    { 
      "name": "Stripe", 
    "country": "US", 
    "active": true 
    },
    { 
      "name": "Stripe", 
    "country": "BR", 
    "active": true 
    }
  ]
}
```

#### Locale-based format

If `rows` is missing, the loader uses the page locale and then falls back to `en`:

```json
{
  "updatedAt": "2026-06-01",
  "en": [
    { 
      "name": "Stripe", 
      "country": "US", 
      "active": true,
      "description": "description"  
    },
    { 
      "name": "Stripe", 
      "country": "BR", 
      "active": true,
      "description": "description" 
    }
      ],
  "pt": [
    { 
      "name": "Stripe", 
      "country": "US", 
      "active": true,
      "description": "descrição" 
    },
    { 
      "name": "Stripe", 
      "country": "BR", 
      "active": true,
      "description": "descrição" 
    }
  ]
}
```

- `updatedAt`: shown in the table info (“Last updated: …”).
- Each row field name must match a `columns[].key`.
- `null`, `""`, or missing values render an empty cell.

### Search, sorting, and filters

| Feature | Behavior |
| --- | --- |
| Global search | Field in the toolbar; searches across all columns. |
| Sorting | Only columns with `sortable: true`. |
| Dropdown filter | `filterable: true` with `badge`, `tag`, `boolean`, or `country`. |
| Date filter | `filterable: true` with `type: 'date'`. |
| More filters | Up to 2 filters visible; the rest behind the `+` button. |
| Clear filters | Button appears when a filter is active. |
| Pagination | Native DataTables pagination. |

---

## How to use

### Create the JSON data file

1. In the `help-center-content` repository, open your feature branch.
2. Create a JSON file under `data/tables/` (recommended folder).  
   Example path: `data/tables/payment-providers-example.json`.
3. Add the table data in the `rows` format:

   ```json
   {
     "updatedAt": "2026-06-01",
     "rows": [
       {
         "name": "Stripe",
         "country": "US",
         "website": "[Stripe](https://stripe.com)",
         "active": true,
         "fee": 2.9,
         "launched": "2010-09-01",
         "status": "Active",
         "code": "stripe_v2"
       },
       {
         "name": "PagSeguro",
         "country": "BR",
         "website": "[PagSeguro](https://pagseguro.uol.com.br)",
         "active": true,
         "fee": 3.49,
         "launched": "2006-03-15",
         "status": "Active",
         "code": "pagseguro_transparent"
       },
       {
         "name": "MercadoPago",
         "country": "AR",
         "website": "[MercadoPago](https://mercadopago.com)",
         "active": false,
         "fee": 4.99,
         "launched": "2004-10-01",
         "status": "Deprecated",
         "code": "mp_checkout_pro"
       }
     ]
   }
   ```

4. Confirm that every object in `rows` uses the same field names you will use as `key` in the next step (for example, `name`, `country`, `website`).

> **Note:** You can also organize rows by locale (`en`, `pt`, `es`) instead of `rows`. See [JSON formats](#json-formats).

### Add the DataTable tag to the article

1. Open the article markdown file in `help-center-content`.
2. Insert a self-closing `<DataTable>` tag in the article body and point `src` to the JSON path created earlier:

   ```mdx
   ## Payment providers

   Use the table below to compare providers by country and status.

   <DataTable
     src="/data/tables/payment-providers-example.json"
     columns={[
       { key: "name", label: "Provider", type: "text", sortable: true },
       { key: "country", label: "Country", type: "country", sortable: true, filterable: true },
       { key: "website", label: "Website", type: "link" },
       { key: "active", label: "Active", type: "boolean", sortable: true, filterable: true },
       { key: "fee", label: "Fee (%)", type: "number", sortable: true },
       { key: "launched", label: "Launched", type: "date", sortable: true, filterable: true },
       {
         key: "status",
         label: "Status",
         type: "badge",
         sortable: true,
         filterable: true,
         badgeColors: { Active: "Green", Deprecated: "No_Fix", Beta: "Blue" }
       },
       { key: "code", label: "Code", type: "code" }
     ]}
   />
   ```

3. Check the mapping between `src` and the file path:

   | `src` value in the article | File path in `help-center-content` |
   | --- | --- |
   | `/data/tables/payment-providers-example.json` | `data/tables/payment-providers-example.json` |
   | `data/tables/foo.json` | `data/tables/foo.json` |

After completing the steps above and committing, you can [test the rendering](#how-to-test-the-component) or continue with the team's review, localization, and merge flow.

## How to test the component

1. Clone the `helpcenter` repository if you have not already.
2. At the repository root, install dependencies and start the app:

   ```bash
   yarn install
   yarn dev
   ```

3. In the browser, open the preview URL and replace `YOUR-BRANCH-NAME` with your branch name in `help-center-content`:

   ```
   http://localhost:3000/api/preview?branch=YOUR-BRANCH-NAME
   ```

4. Open the article in the correct locale.
5. Confirm that the table loads correctly. You should see the information below rendered:

### Example

| Provider | Country | Website | Active | Fee (%) | Launched | Status | Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Stripe | 🇺🇸 United States | Stripe (link) | ✅ | 2.9 | Sep 1, 2010 | Active (green) | `stripe_v2` |
| PagSeguro | 🇧🇷 Brazil | PagSeguro (link) | ✅ | 3.49 | … | Active | `pagseguro_transparent` |
| MercadoPago | 🇦🇷 Argentina | MercadoPago (link) | ❌ | 4.99 | … | Deprecated | `mp_checkout_pro` |

You should also see:

- Global search.
- Sorting on columns with `sortable: true`.
- Filters on Country, Active, and Status (`filterable: true`).
- Pagination controls.

If the data cannot be loaded, the page shows an unavailable state. See [Troubleshooting](#troubleshooting).

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| “Table data couldn't be loaded” / unavailable | Incorrect `src`, missing JSON on the branch, or invalid path. |
| Table does not appear | Missing or empty `columns`. |
| Empty or unformatted cell | Column `key` missing on the row, or unsuitable `type`. |
| Link shown as text | URL without `http`/`https`, or invalid markdown. |
