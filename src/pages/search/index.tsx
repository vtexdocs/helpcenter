import dynamic from 'next/dynamic'

const Search = dynamic(
  () => import('@vtexdocs/components').then((mod) => ({ default: mod.Search })),
  {
    ssr: false,
  }
)

const SearchPage = () => {
  return <Search />
}

export default SearchPage
