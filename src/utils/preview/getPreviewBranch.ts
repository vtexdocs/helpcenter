import { getLogger } from '../logging/log-util'

const logger = getLogger('getPreviewBranch')

export function getPreviewBranch(
  preview?: boolean,
  previewData?: unknown,
  fallbackBranch = 'main'
): string {
  if (!preview) {
    return fallbackBranch
  }

  try {
    const safePreviewData = JSON.parse(
      JSON.stringify(previewData ?? {})
    ) as Record<string, unknown>

    const branch = safePreviewData?.branch

    if (typeof branch === 'string' && branch.trim().length > 0) {
      return branch.trim()
    }
  } catch (error) {
    // Swallow JSON parse errors and fall back to default branch
    const message = (error as Error).message ?? 'unknown error'
    logger.warn(`failed to parse previewData: ${message}`)
  }

  return fallbackBranch
}
