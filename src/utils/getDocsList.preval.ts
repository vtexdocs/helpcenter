/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import preval from 'next-plugin-preval'
import { getGithubTree } from 'utils/github-utils'

const docsList = {
  'billing-options': 'docs/guides/Getting Started/catalog-overview.md',
}

async function getDocsList() {
  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    'main',
    'getDocsList'
  )
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    const re = /^(?<path>.+\/)*(?<filename>.+)\.(?<filetype>.+)$/
    if (path.startsWith('docs')) {
      const match = path.match(re)
      const filename = match?.groups?.filename
      if (filename) {
        ;(docsList as any)[filename] = path
      }
    }
  })
  return docsList
}

export default preval(getDocsList())
