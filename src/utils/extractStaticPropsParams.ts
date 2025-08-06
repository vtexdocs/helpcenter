import { getDocsPaths } from './getDocsPaths'
import { localeType } from './navigation-utils'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { SectionId } from './typings/unionTypes'
import { ParsedUrlQuery } from 'querystring'

type ExtractedParams = {
  sectionSelected: string
  branch: string
  slug: string
  currentLocale: localeType
  docsPaths: Record<string, { locale: string; path: string }[]>
  docExists: boolean
}

export async function extractStaticPropsParams({
  sectionSelected,
  params,
  locale,
  preview,
  previewData,
  docsPathsGLOBAL,
}: {
  sectionSelected: SectionId
  params: ParsedUrlQuery | undefined
  locale?: string
  preview?: boolean
  previewData?: unknown
  docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null
}): Promise<ExtractedParams> {
  const safePreviewData = JSON.parse(JSON.stringify(previewData || {}))
  const previewBranch =
    preview && Object.prototype.hasOwnProperty.call(safePreviewData, 'branch')
      ? safePreviewData.branch
      : 'main'

  const branch = preview ? previewBranch : 'main'
  const slug = params?.slug as string
  const currentLocale: localeType = (locale as localeType) || 'en'

  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getDocsPaths(sectionSelected)
  }
  const docsPaths =
    preview || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
      ? await getDocsPaths(sectionSelected, branch)
      : docsPathsGLOBAL
  const docExists = Boolean(docsPaths[slug])

  return {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    docsPaths,
    docExists,
  }
}
