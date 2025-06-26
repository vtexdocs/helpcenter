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
      const fileLocale = match?.groups?.locale ? match?.groups?.locale : ''
      if (
        match?.groups?.filetype === 'md' ||
        match?.groups?.filetype === 'mdx'
      ) {
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

let cachedRepoTree: any = null

function isStaticBuild() {
  return process.env.NEXT_PHASE === 'phase-production-build'
}

function buildDocsPathsFromTree(repoTree: any, category: string) {
  const docsPaths: { [slug: string]: { locale: string; path: string }[] } = {}
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    // Match docs/{locale}/{category}/.../{filename}.md(x)
    const re = /^docs\/(?<locale>pt|es|en)\/(?<rest>.+)\.(?<filetype>md|mdx)$/
    const match = path.match(re)
    if (match) {
      const { locale, rest } = match.groups as any
      const segments = rest.split('/')
      const fileCategory = segments[0]
      if (fileCategory === category) {
        // Use only the filename as the slug
        const slug = segments[segments.length - 1]
        if (!docsPaths[slug]) docsPaths[slug] = []
        docsPaths[slug].push({
          locale,
          path,
        })
      }
    }
  })
  return docsPaths
}

export async function getDocsPaths(
  category:
    | 'tracks'
    | 'tutorials'
    | 'announcements'
    | 'faq'
    | 'known-issues'
    | 'troubleshooting',
  branch = 'main'
) {
  const staticBuild = isStaticBuild()
  if (staticBuild && cachedRepoTree) {
    return buildDocsPathsFromTree(cachedRepoTree, category)
  }
  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch
  )
  if (staticBuild) {
    cachedRepoTree = repoTree
  }
  return buildDocsPathsFromTree(repoTree, category)
}

export async function getStaticPathsForDocType(
  docType: 'tracks' | 'tutorials',
  branch = 'main'
): Promise<{ params: { lang: string; slug: string } }[]> {
  const pathsForStaticGeneration: { params: { lang: string; slug: string } }[] =
    []

  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch
  )

  const pathRegex = new RegExp(
    '^(?<lang>en|es|pt)/docs/(?<actualDocType>tracks|tutorials)/(?<slug>.+)\\.(md|mdx)$'
  )

  // @ts-ignore
  repoTree.tree.forEach((node: any) => {
    const path = node.path as string
    const match = path.match(pathRegex)

    if (match && match.groups) {
      const { lang, actualDocType: pathDocType, slug } = match.groups
      if (pathDocType === docType) {
        pathsForStaticGeneration.push({
          params: { lang, slug },
        })
      }
    }
  })
  return pathsForStaticGeneration
}
