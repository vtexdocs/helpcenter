import { NextApiRequest, NextApiResponse } from 'next'
import octokit from 'utils/octokitConfig'

interface GitHubFileContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  content: string
  encoding: string
  _links: {
    self: string
    git: string
    html: string
  }
}

async function getFile(org: string, repo: string, path: string) {
  const response = await octokit.request(
    'GET /repos/{org}/{repo}/contents/{path}',
    {
      org: org,
      repo: repo,
      path: path,
    }
  )

  const fileData = response.data as GitHubFileContent

  // Decode base64 content to get the actual markdown
  if (fileData.content && fileData.encoding === 'base64') {
    const decodedContent = Buffer.from(fileData.content, 'base64').toString(
      'utf-8'
    )
    return {
      ...fileData,
      content: decodedContent,
      encoding: 'utf-8',
    }
  }

  return fileData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.key !== process.env.KNOWN_ISSUES_KEY) {
    res.status(401).end()
    return
  }

  const { path } = req.query

  if (!path || typeof path !== 'string') {
    res.status(400).json({ error: 'Path parameter is required' })
    return
  }

  // Ensure it's a markdown or JSON file
  if (!path.endsWith('.md') && !path.endsWith('.json')) {
    res.status(400).json({
      error: 'Only markdown files (.md) and JSON files (.json) are supported',
    })
    return
  }

  try {
    const fileContent = await getFile('vtexdocs', 'admin-docs-content', path)
    res.status(200).json(fileContent)
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string }
    if (err.status === 404) {
      res.status(404).json({ error: 'File not found' })
    } else {
      res.status(500).json({
        error: 'Failed to fetch file',
        details: err.message || 'Unknown error',
      })
    }
  }
}
