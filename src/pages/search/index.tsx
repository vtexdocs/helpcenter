import { NextPage } from 'next'
import { Search } from '@vtexdocs/components'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { keyword } = router.query
  const intl = useIntl()

  //(todo) adicionar internacionalização
  const pageTitle = keyword
    ? `${intl.formatMessage({
        id: 'search_results.text',
      })}: ${keyword}`
    : 'VTEX Help Center'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Search />
    </>
  )
}

export default SearchPage
