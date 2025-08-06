export const fetchRawMarkdown = async (
  branch: string,
  path: string
): Promise<string> => {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
    )
    return await res.text()
  } catch (err) {
    console.error('Error fetching markdown:', err)
    return ''
  }
}
