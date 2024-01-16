import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const KnownIssuesIndex: React.FC = () => {
  const router = useRouter()
  router.replace('/known-issues/1')

  return <></>
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.writeHead(302, { Location: '/known-issues/1' })
  res.end()

  return {
    props: {},
  }
}

export default KnownIssuesIndex
