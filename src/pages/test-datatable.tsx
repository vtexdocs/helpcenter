/**
 * LOCAL TEST PAGE — delete before merging.
 * Route: http://localhost:3000/test-datatable
 *
 * Tests all DataTable column types with hardcoded data (no help-center-content needed).
 */
import { DataTablesProvider } from 'components/datatable/context'
import DataTable from 'components/datatable'
import type { DataTablesData } from 'components/datatable/datatable.types'

const testData: DataTablesData = {
  'test/all-types.json': {
    updatedAt: '2026-06-01',
    rows: [
      {
        name: 'Stripe',
        country: 'US',
        website: '[Stripe](https://stripe.com)',
        active: true,
        fee: 2.9,
        launched: '2010-09-01',
        status: 'Active',
        code: 'stripe_v2',
      },
      {
        name: 'PagSeguro',
        country: 'BR',
        website: '[PagSeguro](https://pagseguro.uol.com.br)',
        active: true,
        fee: 3.49,
        launched: '2006-03-15',
        status: 'Active',
        code: 'pagseguro_transparent',
      },
      {
        name: 'MercadoPago',
        country: 'AR',
        website: '[MercadoPago](https://mercadopago.com)',
        active: false,
        fee: 4.99,
        launched: '2004-10-01',
        status: 'Deprecated',
        code: 'mp_checkout_pro',
      },
      {
        name: 'Adyen',
        country: 'NL',
        website: '[Adyen](https://adyen.com)',
        active: true,
        fee: 0.3,
        launched: '2006-01-01',
        status: 'Beta',
        code: 'adyen_hpp',
      },
      {
        name: 'Mobile Money',
        country: 'CD',
        website: 'https://example.com',
        active: true,
        fee: 2.5,
        launched: '2015-06-01',
        status: 'Active',
        code: 'mobile_money_cd',
      },
      {
        name: 'PayPal UK',
        country: 'GB',
        website: '[PayPal](https://paypal.co.uk)',
        active: true,
        fee: 3.4,
        launched: '1998-12-01',
        status: 'Active',
        code: 'paypal_uk',
      },
      {
        name: 'Pacific Pay',
        country: 'FM',
        website: 'https://example.com',
        active: false,
        fee: 5.0,
        launched: '2018-03-15',
        status: 'Beta',
        code: 'pacific_pay',
      },
      {
        name: 'Caribbean Gateway',
        country: 'VC',
        website: '[Caribbean Gateway](https://example.com)',
        active: true,
        fee: 4.5,
        launched: '2020-01-10',
        status: 'Active',
        code: 'caribbean_gw',
      },
      {
        name: 'Bosnia Payment',
        country: 'BA',
        website: 'https://example.com',
        active: true,
        fee: 3.0,
        launched: '2012-08-20',
        status: 'Deprecated',
        code: 'bosnia_pay',
      },
    ],
  },
  'test/boolean-sort.json': {
    rows: [
      { label: 'Enabled feature', enabled: true },
      { label: 'Disabled feature', enabled: false },
      { label: 'Another enabled', enabled: true },
      { label: 'Another disabled', enabled: false },
    ],
  },
  'test/empty-data.json': {
    rows: [],
  },
  'test/sparse-data.json': {
    updatedAt: '2026-05-15',
    rows: [
      { name: 'Complete Row', country: 'US', price: 99.99, status: 'Active' },
      { name: 'Missing Country', price: 49.99, status: 'Pending' },
      { name: 'Missing Price', country: 'BR', status: 'Active' },
      { name: 'Missing Status', country: 'AR', price: 29.99 },
      {
        name: 'Unknown country code (XX)',
        country: 'XX',
        price: 10.0,
        status: 'Active',
      },
    ],
  },
  'test/large-numbers.json': {
    rows: [
      {
        item: 'Total Users',
        count: 1500000,
        growth: 15.5,
        revenue: 2500000.75,
      },
      {
        item: 'Active Sessions',
        count: 45000,
        growth: -2.3,
        revenue: 125000.0,
      },
      {
        item: 'API Calls',
        count: 9876543210,
        growth: 234.7,
        revenue: 50000000.99,
      },
      { item: 'Small Value', count: 42, growth: 0.01, revenue: 0.99 },
      { item: 'Zero Values', count: 0, growth: 0, revenue: 0 },
    ],
  },
  'test/link-variations.json': {
    rows: [
      {
        title: 'Markdown link',
        link: '[Stripe Docs](https://stripe.com/docs)',
      },
      { title: 'Plain URL', link: 'https://example.com' },
      { title: 'Not a URL (plain text)', link: 'No link here' },
      { title: 'Empty', link: '' },
      { title: 'Null', link: null },
    ],
  },
  'test/currency-mix.json': {
    rows: [
      { product: 'Pro Plan', price: 99.99 },
      { product: 'Enterprise', price: 499.0 },
      { product: 'Starter', price: 1990.0 },
      { product: 'Premium', price: 12500.0 },
      { product: 'Basic', price: 599.0 },
    ],
  },
  'test/invalid-currency.json': {
    rows: [{ item: 'Valid number', amount: 42.0 }],
  },
  'test/tag-variety.json': {
    rows: [
      { feature: 'Authentication', status: 'Stable', priority: 'High' },
      { feature: 'File Upload', status: 'Beta', priority: 'Medium' },
      { feature: 'Dark Mode', status: 'Experimental', priority: 'Low' },
      {
        feature: 'Email Notifications',
        status: 'Deprecated',
        priority: 'None',
      },
      { feature: 'Two-Factor Auth', status: 'Stable', priority: 'Critical' },
      { feature: 'PDF Export', status: 'In Development', priority: 'High' },
    ],
  },
  'test/date-formats.json': {
    updatedAt: '2026-07-01T15:30:00Z',
    rows: [
      { event: 'Project Start', date: '2020-01-15' },
      { event: 'First Release', date: '2020-06-30' },
      { event: 'Major Update', date: '2022-12-25' },
      { event: 'Latest Release', date: '2026-06-15' },
      { event: 'Future Milestone', date: '2027-01-01' },
      { event: 'Invalid date (fallback to raw text)', date: 'not-a-date' },
    ],
  },
  'test/long-column-names.json': {
    rows: [
      {
        description: 'Payment Gateway Integration Module',
        location: 'US',
        documentation: '[Read Documentation](https://example.com/docs)',
        production_ready: true,
        monthly_volume: 125000,
        transaction_fee: 2.5,
        last_deployment: '2026-06-15',
        current_status: 'Stable',
        internal_code: 'PGW_INT_v2.4.1',
      },
      {
        description: 'Customer Relationship Management System',
        location: 'GB',
        documentation: '[View Guide](https://example.com/crm)',
        production_ready: false,
        monthly_volume: 45000,
        transaction_fee: 1.99,
        last_deployment: '2026-05-20',
        current_status: 'Beta',
        internal_code: 'CRM_SYS_v1.0.0',
      },
    ],
  },
  'test/pagination.json': {
    rows: [
      {
        id: 1,
        name: 'Stripe',
        country: 'US',
        revenue: 5000000,
        active: true,
        launched: '2010-09-01',
      },
      {
        id: 2,
        name: 'PayPal',
        country: 'US',
        revenue: 8500000,
        active: true,
        launched: '1998-12-01',
      },
      {
        id: 3,
        name: 'Adyen',
        country: 'NL',
        revenue: 3200000,
        active: true,
        launched: '2006-01-01',
      },
      {
        id: 4,
        name: 'Square',
        country: 'US',
        revenue: 2100000,
        active: true,
        launched: '2009-02-01',
      },
      {
        id: 5,
        name: 'Braintree',
        country: 'US',
        revenue: 1800000,
        active: true,
        launched: '2007-09-01',
      },
      {
        id: 6,
        name: 'Worldpay',
        country: 'GB',
        revenue: 2900000,
        active: true,
        launched: '1989-01-01',
      },
      {
        id: 7,
        name: 'PagSeguro',
        country: 'BR',
        revenue: 950000,
        active: true,
        launched: '2006-03-15',
      },
      {
        id: 8,
        name: 'MercadoPago',
        country: 'AR',
        revenue: 1200000,
        active: false,
        launched: '2004-10-01',
      },
      {
        id: 9,
        name: 'Checkout.com',
        country: 'GB',
        revenue: 780000,
        active: true,
        launched: '2012-06-01',
      },
      {
        id: 10,
        name: '2Checkout',
        country: 'US',
        revenue: 650000,
        active: true,
        launched: '2006-11-01',
      },
      {
        id: 11,
        name: 'Mollie',
        country: 'NL',
        revenue: 890000,
        active: true,
        launched: '2004-01-01',
      },
      {
        id: 12,
        name: 'Klarna',
        country: 'SE',
        revenue: 1500000,
        active: true,
        launched: '2005-02-01',
      },
      {
        id: 13,
        name: 'Razorpay',
        country: 'IN',
        revenue: 720000,
        active: true,
        launched: '2014-04-01',
      },
      {
        id: 14,
        name: 'Paytm',
        country: 'IN',
        revenue: 1100000,
        active: true,
        launched: '2010-08-01',
      },
      {
        id: 15,
        name: 'Alipay',
        country: 'CN',
        revenue: 12000000,
        active: true,
        launched: '2004-02-01',
      },
      {
        id: 16,
        name: 'WeChat Pay',
        country: 'CN',
        revenue: 9500000,
        active: true,
        launched: '2013-08-01',
      },
      {
        id: 17,
        name: 'Payoneer',
        country: 'US',
        revenue: 580000,
        active: true,
        launched: '2005-06-01',
      },
      {
        id: 18,
        name: 'Skrill',
        country: 'GB',
        revenue: 420000,
        active: true,
        launched: '2001-07-01',
      },
      {
        id: 19,
        name: 'Neteller',
        country: 'GB',
        revenue: 390000,
        active: false,
        launched: '1999-01-01',
      },
      {
        id: 20,
        name: 'Authorize.Net',
        country: 'US',
        revenue: 850000,
        active: true,
        launched: '1996-01-01',
      },
      {
        id: 21,
        name: 'Payline',
        country: 'FR',
        revenue: 280000,
        active: true,
        launched: '2011-03-01',
      },
      {
        id: 22,
        name: 'Bambora',
        country: 'CA',
        revenue: 310000,
        active: true,
        launched: '2007-05-01',
      },
      {
        id: 23,
        name: 'BlueSnap',
        country: 'US',
        revenue: 260000,
        active: true,
        launched: '2001-01-01',
      },
      {
        id: 24,
        name: 'PayU',
        country: 'NL',
        revenue: 1400000,
        active: true,
        launched: '2002-01-01',
      },
      {
        id: 25,
        name: 'Flutterwave',
        country: 'NG',
        revenue: 180000,
        active: true,
        launched: '2016-01-01',
      },
    ],
  },
  'test/missing.json': undefined as unknown as { rows: [] },
}

export default function TestDataTable() {
  return (
    <DataTablesProvider value={testData}>
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>DataTable — test page</h1>
        <p style={{ color: '#e31c58', fontWeight: 'bold' }}>
          ⚠️ Delete this page before merging.
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#718096',
            marginBottom: '2rem',
          }}
        >
          Comprehensive test suite covering all column types, edge cases, data
          variations, sorting, filtering, and error handling. No
          help-center-content dependency required.
        </p>

        <h2>All column types</h2>
        <p>
          Tests every supported column type: text, link, country, boolean,
          number, date, badge, and code.
        </p>
        <DataTable
          src="test/all-types.json"
          columns={[
            {
              key: 'name',
              label: 'Provider',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'country',
              label: 'Country',
              type: 'country',
              sortable: true,
              filterable: true,
            },
            { key: 'website', label: 'Website', type: 'link', sortable: true },
            {
              key: 'active',
              label: 'Active',
              type: 'boolean',
              sortable: true,
              filterable: true,
            },
            { key: 'fee', label: 'Fee (%)', type: 'number', sortable: true },
            {
              key: 'launched',
              label: 'Launched',
              type: 'date',
              sortable: true,
            },
            {
              key: 'status',
              label: 'Status',
              type: 'badge',
              sortable: true,
              filterable: true,
              badgeColors: {
                Active: 'Green',
                Deprecated: 'No_Fix',
                Beta: 'Blue',
              },
            },
            {
              key: 'code',
              label: 'Code',
              type: 'code',
              sortable: true,
              filterable: true,
            },
          ]}
        />

        <h2>Boolean sort test</h2>
        <p>Sorting should go true → true → false → false (not alphabetical).</p>
        <DataTable
          src="test/boolean-sort.json"
          columns={[
            {
              key: 'label',
              label: 'Feature',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'enabled',
              label: 'Enabled',
              type: 'boolean',
              sortable: true,
            },
          ]}
        />

        <h2>Empty data</h2>
        <p>Should show "No data available" message.</p>
        <DataTable
          src="test/empty-data.json"
          columns={[
            { key: 'name', label: 'Name', type: 'text', sortable: true },
            { key: 'value', label: 'Value', type: 'number', sortable: true },
          ]}
        />

        <h2>Sparse data (missing values)</h2>
        <p>
          Tests how empty/null values are handled across different column types.
        </p>
        <DataTable
          src="test/sparse-data.json"
          columns={[
            {
              key: 'name',
              label: 'Name',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'country',
              label: 'Country',
              type: 'country',
              sortable: true,
            },
            {
              key: 'price',
              label: 'Price',
              type: 'currency',
              currency: 'USD',
              sortable: true,
            },
            { key: 'status', label: 'Status', type: 'badge', sortable: true },
          ]}
        />

        <h2>Large numbers & decimals</h2>
        <p>Tests number formatting with various scales and precision.</p>
        <DataTable
          src="test/large-numbers.json"
          columns={[
            {
              key: 'item',
              label: 'Metric',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            { key: 'count', label: 'Count', type: 'number', sortable: true },
            {
              key: 'growth',
              label: 'Growth %',
              type: 'number',
              sortable: true,
            },
            {
              key: 'revenue',
              label: 'Revenue',
              type: 'currency',
              currency: 'USD',
              sortable: true,
            },
          ]}
        />

        <h2>Link variations</h2>
        <p>Tests different combinations of link labels and URLs.</p>
        <DataTable
          src="test/link-variations.json"
          columns={[
            { key: 'title', label: 'Scenario', type: 'text', sortable: true },
            { key: 'link', label: 'Link', type: 'link', sortable: true },
          ]}
        />

        <h2>Multiple currencies</h2>
        <p>Currency defined at column level, not in row data.</p>
        <DataTable
          src="test/currency-mix.json"
          columns={[
            {
              key: 'product',
              label: 'Product',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'price',
              label: 'Price (USD)',
              type: 'currency',
              currency: 'USD',
              sortable: true,
            },
          ]}
        />

        <h2>Invalid currency code (fallback)</h2>
        <p>
          Should render as a plain number when the currency code is
          unrecognized.
        </p>
        <DataTable
          src="test/invalid-currency.json"
          columns={[
            { key: 'item', label: 'Item', type: 'text' },
            {
              key: 'amount',
              label: 'Amount (FAKE)',
              type: 'currency',
              currency: 'FAKE',
            },
          ]}
        />

        <h2>Tag variety</h2>
        <p>Multiple tag columns with different color schemes.</p>
        <DataTable
          src="test/tag-variety.json"
          columns={[
            {
              key: 'feature',
              label: 'Feature',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'status',
              label: 'Status',
              type: 'tag',
              sortable: true,
              filterable: true,
              badgeColors: {
                Stable: 'Green',
                Beta: 'Blue',
                Experimental: 'Scheduled',
                Deprecated: 'No_Fix',
                'In Development': 'Gray',
              },
            },
            {
              key: 'priority',
              label: 'Priority',
              type: 'badge',
              sortable: true,
              filterable: true,
              badgeColors: {
                Critical: 'Closed',
                High: 'Deprecation',
                Medium: 'Scheduled',
                Low: 'Gray',
                None: 'Gray',
              },
            },
          ]}
        />

        <h2>Date variations</h2>
        <p>
          Different date formats and ranges. Shows "Last updated" timestamp.
        </p>
        <DataTable
          src="test/date-formats.json"
          columns={[
            {
              key: 'event',
              label: 'Event',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            { key: 'date', label: 'Date', type: 'date', sortable: true },
          ]}
        />

        <h2>Pagination (25 rows)</h2>
        <p>
          Tests pagination with multiple pages. Default shows 10 rows per page.
        </p>
        <DataTable
          src="test/pagination.json"
          columns={[
            { key: 'id', label: 'ID', type: 'number', sortable: true },
            {
              key: 'name',
              label: 'Payment Provider',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'country',
              label: 'Country',
              type: 'country',
              sortable: true,
              filterable: true,
            },
            {
              key: 'revenue',
              label: 'Annual Revenue',
              type: 'currency',
              currency: 'USD',
              sortable: true,
            },
            { key: 'active', label: 'Active', type: 'boolean', sortable: true },
            {
              key: 'launched',
              label: 'Launch Date',
              type: 'date',
              sortable: true,
            },
          ]}
        />

        <h2>Long column names</h2>
        <p>
          Tests how very long column headers are displayed across all column
          types.
        </p>
        <DataTable
          src="test/long-column-names.json"
          columns={[
            {
              key: 'description',
              label: 'Integration Module Description and Full Name',
              type: 'text',
              sortable: true,
              filterable: true,
            },
            {
              key: 'location',
              label: 'Primary Geographic Location',
              type: 'country',
              sortable: true,
              filterable: true,
            },
            {
              key: 'documentation',
              label: 'Technical Documentation Link',
              type: 'link',
              sortable: true,
            },
            {
              key: 'production_ready',
              label: 'Production Environment Ready Status',
              type: 'boolean',
              sortable: true,
            },
            {
              key: 'monthly_volume',
              label: 'Average Monthly Transaction Volume',
              type: 'number',
              sortable: true,
            },
            {
              key: 'transaction_fee',
              label: 'Transaction Processing Fee Percentage',
              type: 'currency',
              currency: 'USD',
              sortable: true,
            },
            {
              key: 'last_deployment',
              label: 'Most Recent Deployment Date',
              type: 'date',
              sortable: true,
            },
            {
              key: 'current_status',
              label: 'Current Development Status',
              type: 'badge',
              sortable: true,
              filterable: true,
            },
            {
              key: 'internal_code',
              label: 'Internal Version Code Identifier',
              type: 'code',
              sortable: true,
            },
          ]}
        />

        <h2>Missing src (should render nothing, check console for error)</h2>
        <DataTable
          src="test/missing.json"
          columns={[{ key: 'x', label: 'X', type: 'text' }]}
        />
      </div>
    </DataTablesProvider>
  )
}
