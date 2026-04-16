import { DocsPaths } from 'utils/getDocsPaths'
import getGithubFile from 'utils/getGithubFile'
import { LoggerType } from 'utils/logging/log-util'
import { LocaleType } from 'utils/typings/unionTypes'
import { serialize } from 'next-mdx-remote/serialize'

export async function getSeeAlsoData(
  seeAlso: string[] = [],
  docsPaths: DocsPaths,
  currentLocale: LocaleType,
  logger: LoggerType
) {
  return Promise.all(
    seeAlso.filter(Boolean).map(async (url: string) => {
      const parts = url.split('/')
      const category = parts.at(-2) as string
      const key = parts.at(-1) as string

      const seeAlsoPath = docsPaths[key]?.find(
        (e) => e.locale === currentLocale
      )?.path
      if (!seeAlsoPath) {
        return { url, title: key, category }
      }
      try {
        const seeAlsoContent = await getGithubFile(
          'vtexdocs',
          'help-center-content',
          'main',
          seeAlsoPath
        )
        const seeAlsoSerialized = await serialize(seeAlsoContent, {
          parseFrontmatter: true,
        })
        return {
          url,
          title: seeAlsoSerialized.frontmatter?.title || key,
          category: seeAlsoSerialized.frontmatter?.category || category,
        }
      } catch (error) {
        logger.error(
          `Failed to load seeAlso content for ${seeAlsoPath}: ${String(error)}`
        )
        return { url, title: key, category }
      }
    })
  )
}
