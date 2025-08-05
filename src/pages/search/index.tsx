import { NextPage } from 'next'
import { Search } from '@vtexdocs/components'
import { useRouter } from 'next/router'
import Head from 'next/head'

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { keyword } = router.query

  //(todo) adicionar internacionalização
  const pageTitle = keyword ? `Showing results for ${keyword}` : 'Search'

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
