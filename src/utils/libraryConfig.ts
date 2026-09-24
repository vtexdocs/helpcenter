/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { SearchConfig } from '@vtexdocs/components'

const useHybridSearch = process.env.NEXT_PUBLIC_HYBRID_SEARCH_ENABLED === 'true'

const libraryConfig = useHybridSearch
  ? {
      backend: 'hybrid' as const,
      hybrid: {
        apiEndpoint:
          process.env.NEXT_PUBLIC_HYBRID_SEARCH_API_ENDPOINT || '/api/search',
        source: 'help-center' as const,
        itemsPerPage: 10,
      },
      index: 'helpcenter-docs',
    }
  : {
      backend: 'algolia' as const,
      algolia: {
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_WRITE_KEY || '',
        index: 'helpcenter-docs',
      },
    }

export default SearchConfig(libraryConfig)
