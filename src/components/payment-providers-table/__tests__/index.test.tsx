import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import PaymentProvidersTable from '../index'

// Country names also appear as filter dropdown options, so cell assertions
// must be scoped to the table.
const table = () => within(screen.getByRole('table'))

const mockRouter = { locale: 'en' }

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

const mockData = {
  updatedAt: '2026-06-11',
  providers: [
    {
      name: 'Aarin',
      payoutSplit: true,
      docs: {
        pt: 'https://help.vtex.com/pt/tutorial/aarin',
        en: 'https://help.vtex.com/en/tutorial/aarin',
        es: 'https://help.vtex.com/es/tutorial/aarin',
      },
      countries: ['BR'],
    },
    {
      name: 'AdyenV3',
      payoutSplit: false,
      docs: {
        pt: 'https://help.vtex.com/pt/tutorial/adyenv3',
        en: 'https://help.vtex.com/en/tutorial/adyenv3',
        es: 'https://help.vtex.com/es/tutorial/adyenv3',
      },
      countries: ['DE', 'BR'],
    },
    {
      name: 'Unlimit',
      payoutSplit: false,
      docs: {
        pt: null,
        en: 'https://help.vtex.com/en/tutorial/unlimit',
        es: null,
      },
      // object form: per-country payout split override
      countries: ['GB', { code: 'MX', payoutSplit: true }],
    },
  ],
}

describe('PaymentProvidersTable', () => {
  beforeEach(() => {
    mockRouter.locale = 'en'
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    ) as unknown as typeof fetch
  })

  it('renders one row per provider/country with localized country names', async () => {
    render(<PaymentProvidersTable />)

    await waitFor(() => expect(screen.getByText('Aarin')).toBeInTheDocument())

    // 3 providers expand to 5 provider/country rows
    expect(screen.getByText('5 result(s)')).toBeInTheDocument()
    expect(table().getByText('Germany')).toBeInTheDocument()
    expect(table().getAllByText('Brazil')).toHaveLength(2)
    expect(table().getByText('United Kingdom')).toBeInTheDocument()
  })

  it('renders country names in Portuguese when locale is pt', async () => {
    mockRouter.locale = 'pt'
    render(<PaymentProvidersTable />)

    await waitFor(() =>
      expect(table().getByText('Alemanha')).toBeInTheDocument()
    )
    expect(table().getByText('Reino Unido')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /Provedor de Pagamento/ })
    ).toBeInTheDocument()
  })

  it('links each provider to the doc page of the current locale, with fallback', async () => {
    mockRouter.locale = 'es'
    render(<PaymentProvidersTable />)

    await waitFor(() => expect(screen.getByText('Aarin')).toBeInTheDocument())

    expect(screen.getByRole('link', { name: 'Aarin' })).toHaveAttribute(
      'href',
      'https://help.vtex.com/es/tutorial/aarin'
    )
    // Unlimit has no ES doc -> falls back to EN
    expect(screen.getAllByRole('link', { name: 'Unlimit' })[0]).toHaveAttribute(
      'href',
      'https://help.vtex.com/en/tutorial/unlimit'
    )
  })

  it('filters by accent-insensitive text search', async () => {
    mockRouter.locale = 'pt'
    render(<PaymentProvidersTable />)
    await waitFor(() =>
      expect(table().getByText('Alemanha')).toBeInTheDocument()
    )

    // "alemanha" typed without accent should match "Alemanha"
    fireEvent.change(screen.getByPlaceholderText('País, provedor...'), {
      target: { value: 'alemanha' },
    })

    expect(screen.getByText('1 resultado(s)')).toBeInTheDocument()
    expect(screen.getByText('AdyenV3')).toBeInTheDocument()
    expect(screen.queryByText('Aarin')).not.toBeInTheDocument()
  })

  it('filters by country', async () => {
    render(<PaymentProvidersTable />)
    await waitFor(() => expect(screen.getByText('Aarin')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('combobox', { name: 'Country' }), {
      target: { value: 'BR' },
    })

    expect(screen.getByText('2 result(s)')).toBeInTheDocument()
    expect(screen.getByText('Aarin')).toBeInTheDocument()
    expect(screen.getByText('AdyenV3')).toBeInTheDocument()
    expect(screen.queryByText('Unlimit')).not.toBeInTheDocument()
  })

  it('filters by payout split, honoring per-country overrides', async () => {
    render(<PaymentProvidersTable />)
    await waitFor(() => expect(screen.getByText('Aarin')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('combobox', { name: 'Payout Split' }), {
      target: { value: 'yes' },
    })

    // Aarin (BR, split=true) + Unlimit MX override (split=true)
    expect(screen.getByText('2 result(s)')).toBeInTheDocument()
    expect(table().getByText('Aarin')).toBeInTheDocument()
    expect(table().getByText('Mexico')).toBeInTheDocument()
    expect(table().queryByText('Germany')).not.toBeInTheDocument()
  })

  it('sorts by provider when the column header is clicked', async () => {
    render(<PaymentProvidersTable />)
    await waitFor(() => expect(screen.getByText('Aarin')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Payment Provider/ }))

    const firstDataRow = screen.getAllByRole('row')[1]
    expect(firstDataRow).toHaveTextContent('Aarin')

    // Click again to invert the order
    fireEvent.click(screen.getByRole('button', { name: /Payment Provider/ }))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Unlimit')
  })

  it('paginates results and lets the user change the page size', async () => {
    // One provider available in 30 countries -> 30 rows, 2 pages of 25
    const codes = [
      'AR',
      'AT',
      'AU',
      'BE',
      'BG',
      'BR',
      'CA',
      'CH',
      'CL',
      'CO',
      'CY',
      'CZ',
      'DE',
      'DK',
      'EE',
      'ES',
      'FI',
      'FR',
      'GB',
      'GR',
      'HK',
      'HR',
      'HU',
      'IE',
      'IN',
      'IT',
      'JP',
      'LT',
      'LU',
      'LV',
    ]

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            updatedAt: '2026-06-11',
            providers: [
              {
                name: 'GlobalPay',
                payoutSplit: false,
                docs: { pt: null, en: null, es: null },
                countries: codes,
              },
            ],
          }),
      })
    ) as unknown as typeof fetch

    render(<PaymentProvidersTable />)
    await waitFor(() =>
      expect(screen.getByText('30 result(s)')).toBeInTheDocument()
    )

    // Default page size 25 -> 25 rows + header row, page 1 of 2
    expect(screen.getAllByRole('row')).toHaveLength(26)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(6)

    // "All" shows every row and hides the pagination bar
    fireEvent.change(screen.getByRole('combobox', { name: 'Show' }), {
      target: { value: 'all' },
    })
    expect(screen.getAllByRole('row')).toHaveLength(31)
    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument()
  })

  it('shows an error message when the data cannot be loaded', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ) as unknown as typeof fetch

    render(<PaymentProvidersTable />)

    await waitFor(() =>
      expect(screen.getByText('Could not load the data.')).toBeInTheDocument()
    )
  })
})
