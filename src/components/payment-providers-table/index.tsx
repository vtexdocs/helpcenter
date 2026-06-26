/**
 * <PaymentProvidersTable /> — searchable, filterable table of payment
 * providers by country, used by the "List of Payment Providers by Country"
 * articles (PT/EN/ES) instead of an <iframe>.
 *
 * Usage in article markdown:
 *
 *   <PaymentProvidersTable />
 *
 * Data source: a single payment-providers.json shared by all locales,
 * maintained at public/payment-providers.json in vtexdocs/help-center-content
 * and validated by CI there. Country names are generated client-side from
 * ISO 3166-1 alpha-2 codes via Intl.DisplayNames, so no per-locale data is
 * stored.
 *
 * TODO(i18n): UI strings are inlined for now; move them to
 * src/messages/{pt,en,es}.json once the component location is settled.
 */
import { startTransition, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import styles from './styles.module.css'

const DATA_URL =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/payment-providers.json'

// Minimal Intl.DisplayNames typing (tsconfig lib predates es2021.intl)
interface RegionDisplayNames {
  of(code: string): string | undefined
}

interface IntlWithDisplayNames {
  DisplayNames: new (
    locales: string[],
    options: { type: 'region' }
  ) => RegionDisplayNames
}

type Locale = 'pt' | 'en' | 'es'

interface CountryOverride {
  code: string
  payoutSplit: boolean
}

interface Provider {
  name: string
  payoutSplit: boolean
  docs: Record<Locale, string | null>
  countries: Array<string | CountryOverride>
}

interface ProvidersData {
  updatedAt: string
  providers: Provider[]
}

interface Row {
  code: string
  countryName: string
  countryNorm: string
  provider: string
  providerNorm: string
  docUrl: string | null
  payoutSplit: boolean
}

type SortColumn = 'country' | 'provider' | 'split'

const I18N: Record<Locale, Record<string, string>> = {
  pt: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'País, provedor...',
    countryLabel: 'País',
    splitLabel: 'Split de Recebíveis',
    showLabel: 'Exibir',
    allOption: 'Todos',
    allCountries: 'Todos os países',
    both: 'Ambos',
    yes: 'Sim',
    no: 'Não',
    colCountry: 'País',
    colProvider: 'Provedor de Pagamento',
    colSplit: 'Split de Recebíveis',
    results: 'resultado(s)',
    pageOf: 'Página {page} de {total}',
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    empty: 'Nenhum resultado encontrado.',
    loadError: 'Não foi possível carregar os dados.',
  },
  en: {
    searchLabel: 'Search',
    searchPlaceholder: 'Country, provider...',
    countryLabel: 'Country',
    splitLabel: 'Payout Split',
    showLabel: 'Show',
    allOption: 'All',
    allCountries: 'All countries',
    both: 'Both',
    yes: 'Yes',
    no: 'No',
    colCountry: 'Country',
    colProvider: 'Payment Provider',
    colSplit: 'Payout Split',
    results: 'result(s)',
    pageOf: 'Page {page} of {total}',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    empty: 'No results found.',
    loadError: 'Could not load the data.',
  },
  es: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'País, proveedor...',
    countryLabel: 'País',
    splitLabel: 'Split de Cobros',
    showLabel: 'Mostrar',
    allOption: 'Todos',
    allCountries: 'Todos los países',
    both: 'Ambos',
    yes: 'Sí',
    no: 'No',
    colCountry: 'País',
    colProvider: 'Proveedor de Pago',
    colSplit: 'Split de Cobros',
    results: 'resultado(s)',
    pageOf: 'Página {page} de {total}',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    empty: 'No se encontraron resultados.',
    loadError: 'No fue posible cargar los datos.',
  },
}

const PAGE_SIZES = [25, 50, 75, 100] as const

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

interface Props {
  dataUrl?: string
}

const PaymentProvidersTable = ({ dataUrl = DATA_URL }: Props) => {
  const router = useRouter()
  const locale: Locale =
    router.locale === 'pt' || router.locale === 'es' ? router.locale : 'en'

  const t = I18N[locale]

  const [data, setData] = useState<ProvidersData | null>(null)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [split, setSplit] = useState<'' | 'yes' | 'no'>('')
  const [sortBy, setSortBy] = useState<SortColumn>('country')
  const [sortDir, setSortDir] = useState<1 | -1>(1)
  const [pageSize, setPageSize] = useState<number | 'all'>(25)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((json: ProvidersData) => {
        // startTransition avoids "Suspense boundary received an update before
        // it finished hydrating": the article hydrates lazily (MDXRemote
        // `lazy`), and the fetch may resolve before hydration completes.
        if (!cancelled) startTransition(() => setData(json))
      })
      .catch(() => {
        if (!cancelled) startTransition(() => setError(true))
      })

    return () => {
      cancelled = true
    }
  }, [dataUrl])

  const { countryNames, collator } = useMemo(
    () => ({
      countryNames: new (Intl as unknown as IntlWithDisplayNames).DisplayNames(
        [locale],
        { type: 'region' }
      ),
      collator: new Intl.Collator(locale, { sensitivity: 'base' }),
    }),
    [locale]
  )

  const rows: Row[] = useMemo(() => {
    if (!data) return []

    return data.providers.flatMap((provider) =>
      provider.countries.map((entry) => {
        const code = typeof entry === 'string' ? entry : entry.code
        const payoutSplit =
          typeof entry === 'string' ? provider.payoutSplit : entry.payoutSplit
        const countryName = countryNames.of(code) ?? code

        return {
          code,
          countryName,
          countryNorm: normalize(countryName),
          provider: provider.name,
          providerNorm: normalize(provider.name),
          docUrl: provider.docs[locale] ?? provider.docs.en ?? provider.docs.pt,
          payoutSplit,
        }
      })
    )
  }, [data, countryNames, locale])

  const countryOptions = useMemo(() => {
    const byCode = new Map<string, string>()
    for (const row of rows) byCode.set(row.code, row.countryName)

    return Array.from(byCode.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => collator.compare(a.name, b.name))
  }, [rows, collator])

  const visibleRows = useMemo(() => {
    const query = normalize(search.trim())

    const filtered = rows.filter((row) => {
      if (country && row.code !== country) return false
      if (split === 'yes' && !row.payoutSplit) return false
      if (split === 'no' && row.payoutSplit) return false
      if (!query) return true
      return row.countryNorm.includes(query) || row.providerNorm.includes(query)
    })

    return filtered.sort((a, b) => {
      let cmp =
        sortBy === 'provider'
          ? collator.compare(a.provider, b.provider)
          : sortBy === 'split'
          ? Number(a.payoutSplit) - Number(b.payoutSplit)
          : collator.compare(a.countryName, b.countryName)

      if (cmp === 0) {
        cmp =
          collator.compare(a.countryName, b.countryName) ||
          collator.compare(a.provider, b.provider)
      }

      return cmp * sortDir
    })
  }, [rows, search, country, split, sortBy, sortDir, collator])

  const toggleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDir((dir) => (dir === 1 ? -1 : 1))
    } else {
      setSortBy(column)
      setSortDir(1)
    }
  }

  const effectivePageSize =
    pageSize === 'all' ? Math.max(visibleRows.length, 1) : pageSize
  const totalPages = Math.max(
    1,
    Math.ceil(visibleRows.length / effectivePageSize)
  )
  const currentPage = Math.min(page, totalPages)
  const pageRows = visibleRows.slice(
    (currentPage - 1) * effectivePageSize,
    currentPage * effectivePageSize
  )

  if (error) return <p className={styles.empty}>{t.loadError}</p>

  const columns: Array<[SortColumn, string]> = [
    ['country', t.colCountry],
    ['provider', t.colProvider],
    ['split', t.colSplit],
  ]

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span>{t.searchLabel}</span>
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </label>
        <label className={styles.field}>
          <span>{t.countryLabel}</span>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setPage(1)
            }}
          >
            <option value="">{t.allCountries}</option>
            {countryOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{t.splitLabel}</span>
          <select
            value={split}
            onChange={(e) => {
              setSplit(e.target.value as '' | 'yes' | 'no')
              setPage(1)
            }}
          >
            <option value="">{t.both}</option>
            <option value="yes">{t.yes}</option>
            <option value="no">{t.no}</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>{t.showLabel}</span>
          <select
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
              setPage(1)
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
            <option value="all">{t.allOption}</option>
          </select>
        </label>
      </div>

      <p className={styles.count} role="status">
        {visibleRows.length} {t.results}
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(([column, label]) => (
              <th
                key={column}
                scope="col"
                aria-sort={
                  sortBy === column
                    ? sortDir === 1
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <button type="button" onClick={() => toggleSort(column)}>
                  {label}
                  {sortBy === column && (
                    <span>{sortDir === 1 ? ' ▲' : ' ▼'}</span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.empty}>
                {data ? t.empty : '…'}
              </td>
            </tr>
          )}
          {pageRows.map((row) => (
            <tr key={`${row.code}-${row.provider}`}>
              <td className={styles.country}>
                <img
                  src={`https://flagcdn.com/24x18/${row.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/48x36/${row.code.toLowerCase()}.png 2x`}
                  alt=""
                  width={24}
                  height={18}
                  loading="lazy"
                />
                <strong>{row.countryName}</strong>
              </td>
              <td>
                {row.docUrl ? (
                  <a
                    href={row.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.provider}
                  </a>
                ) : (
                  row.provider
                )}
              </td>
              <td>
                <span
                  className={`${styles.badge} ${
                    row.payoutSplit ? styles.badgeYes : styles.badgeNo
                  }`}
                >
                  {row.payoutSplit ? t.yes : t.no}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            aria-label={t.prevPage}
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            ‹
          </button>
          <span>
            {t.pageOf
              .replace('{page}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </span>
          <button
            type="button"
            aria-label={t.nextPage}
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default PaymentProvidersTable
