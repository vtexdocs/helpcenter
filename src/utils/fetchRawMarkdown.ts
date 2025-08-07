export const fetchRawMarkdown = async (
  category: string,
  branch: string,
  path: string
): Promise<string> => {
  try {
    const repo =
      category === 'known-issues' ? 'known-issues' : 'help-center-content'
    const res = await fetch(
      `https://raw.githubusercontent.com/vtexdocs/${repo}/${branch}/${path}`
    )
    return await res.text()
  } catch (err) {
    console.error('Error fetching markdown:', err)
    return ''
  }
}
