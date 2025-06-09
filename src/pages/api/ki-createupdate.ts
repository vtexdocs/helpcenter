import { NextApiRequest, NextApiResponse } from 'next'
import octokit from 'utils/octokitConfig'

async function createUpdate(
  ref: string,
  path: string,
  content: string,
  message: string
) {
  const response = octokit.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'vtexdocs',
      repo: 'known-issues',
      path: path,
      message: message,
      committer: {
        name: 'vtex-known-issues[bot]',
        email: '213649991+vtex-known-issues[bot]@users.noreply.github.com',
      },
      branch: ref,
      content: content,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  return (await response).data
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.key !== process.env.KNOWN_ISSUES_KEY) {
    res.status(401).end()
    return
  }
  const content = req.body.content
  const path = req.body.path
  const message = req.body.message
  const ref = req.body.ref || 'main'
  res.status(200).json(await createUpdate(ref, path, content, message))
  return
}
