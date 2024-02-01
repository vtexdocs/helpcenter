/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import octokit from 'utils/octokitConfig'

async function getGithubTree(org: string, repo: string, ref: string) {
  const response = octokit.request(
    'GET /repos/{org}/{repo}/git/trees/{ref}?recursive=true',
    {
      org: org,
      repo: repo,
      ref: ref,
    }
  )

  return (await response).data
}

//https://api.github.com/repos/vtexdocs/devportal/commits?path=README.md

export async function getAllDocsPaths(branch = 'main') {
  const docsPaths: { [slug: string]: { locale: string; path: string }[] } = {}

  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch
  )
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    const re =
      /^(?<path>.+\/)*(?<locale>pt|es|en+)\/(?<localeDir>.+\/)*(?<filename>.+)\.(?<filetype>.+)$/
    if (path.startsWith(`docs/`)) {
      const match = path.match(re)
      const filename = match?.groups?.filename ? match?.groups?.filename : ''
      const filetype = match?.groups?.filetype ? match?.groups?.filetype : ''
      const fileLocale = match?.groups?.locale ? match?.groups?.locale : ''
      if (filetype === 'md' || filetype === 'mdx') {
        if (!docsPaths[filename]) docsPaths[filename] = []
        docsPaths[filename].push({
          locale: fileLocale,
          path,
        })
      }
    }
  })
  return docsPaths
}

export async function getDocsPaths(
  category: 'tracks' | 'tutorials' | 'announcements' | 'faq' | 'known-issues',
  branch = 'main'
) {
  const docsPaths: { [slug: string]: { locale: string; path: string }[] } = {}

  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch
  )
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    const re =
      /^(?<path>.+\/)*(?<locale>pt|es|en+)\/(?<localeDir>.+\/)*(?<filename>.+)\.(?<filetype>.+)$/
    if (path.startsWith(`docs/${category}`)) {
      const match = path.match(re)
      const filename = match?.groups?.filename ? match?.groups?.filename : ''
      const filetype = match?.groups?.filetype ? match?.groups?.filetype : ''
      const fileLocale = match?.groups?.locale ? match?.groups?.locale : ''
      if (filetype === 'md' || filetype === 'mdx') {
        if (!docsPaths[filename]) docsPaths[filename] = []
        docsPaths[filename].push({
          locale: fileLocale,
          path,
        })
      }
    }
  })
  return docsPaths
}
