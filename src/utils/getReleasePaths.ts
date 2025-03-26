/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { getGithubTree } from 'utils/github-utils'

const docsPaths: { [slug: string]: string } = {}

export default async function getReleasePaths(branch = 'main', locale = 'en') {
  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch,
    'getReleasePaths'
  )
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    const re = /^(?<path>.+\/)*(?<filename>.+)\.(?<filetype>.+)$/
    if (path.startsWith(`docs/announcements/${locale}`)) {
      const match = path.match(re)
      const filename = match?.groups?.filename ? match?.groups?.filename : ''
      const filetype = match?.groups?.filetype ? match?.groups?.filetype : ''
      if (filetype === 'md' || filetype === 'mdx') {
        ;(docsPaths as any)[filename] = path
      }
    }
  })
  return docsPaths
}
