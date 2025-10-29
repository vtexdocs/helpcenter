import { serialize } from 'next-mdx-remote/serialize'
import { LoggerType } from './logging/log-util'
import { localeType } from './navigation-utils'
import { DocsPaths } from './getDocsPaths'
import { fetchGitHubFileWithFallback } from './githubCdnFallback'

export const parseFrontmatter = async (content: string, logger: LoggerType) => {
  try {
    const onlyFrontmatter = `---\n${content.split('---')[1]}---\n`
    const { frontmatter } = await serialize(onlyFrontmatter, {
      parseFrontmatter: true,
    })
    return frontmatter
  } catch (error) {
    logger.error(`Error parsing frontmatter: ${error}`)
    return null
  }
}

export const fetchFromGithub = async (
  path: string,
  slug: string,
  repo: string,
  branch = 'main',
  logger: LoggerType
) => {
  try {
    const content = await fetchGitHubFileWithFallback(
      'vtexdocs',
      repo,
      branch,
      path,
      {
        cdnFallbackEnabled: true,
        preferredCdn: 'jsdelivr',
        logger,
      }
    )
    return { content, slug }
  } catch (error) {
    logger.error(`Error fetching data for path ${path}: ${error}`)
    return { content: '', slug }
  }
}

export const getPathBySlug = (
  slug: string,
  docsPathsGLOBAL: DocsPaths,
  currentLocale: localeType
): string | undefined => {
  return docsPathsGLOBAL[slug]?.find((entry) => entry.locale === currentLocale)
    ?.path
}

export const fetchBatch = async (
  batch: string[],
  repo: string,
  docsPathsGLOBAL: DocsPaths,
  currentLocale: localeType,
  branch: string,
  logger: LoggerType
) => {
  const promises = batch.map(async (slug) => {
    const path = getPathBySlug(slug, docsPathsGLOBAL, currentLocale)
    return path
      ? fetchFromGithub(path, slug, repo, branch, logger)
      : { content: '', slug }
  })

  return Promise.all(promises)
}
