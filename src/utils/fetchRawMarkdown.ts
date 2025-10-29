import { fetchGitHubFileWithFallback } from './githubCdnFallback'

export const fetchRawMarkdown = async (
  category: string,
  branch: string,
  path: string
): Promise<string> => {
  try {
    const repo =
      category === 'known-issues' ? 'known-issues' : 'help-center-content'

    // Use CDN fallback system for automatic rate limit handling
    const content = await fetchGitHubFileWithFallback(
      'vtexdocs',
      repo,
      branch,
      path,
      {
        cdnFallbackEnabled: true,
        preferredCdn: 'jsdelivr',
      }
    )

    return content
  } catch (err) {
    console.error('Error fetching markdown:', err)
    return ''
  }
}
