import { NextApiRequest, NextApiResponse } from 'next'
import octokit from 'utils/octokitConfig'

async function createUpdate(
  ref: string,
  path: string,
  content: string,
  message: string,
  sha?: string
) {
  console.log('Creating or updating file:', path, 'on branch:', ref)
  const response = octokit.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'vtexdocs',
      repo: 'known-issues',
      path: path,
      message: message,
      branch: ref,
      sha: sha,
      committer: {
        name: 'vtex-known-issues[bot]',
        email: '213649991+vtex-known-issues[bot]@users.noreply.github.com',
      },
      content: content,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json',
      },
    }
  )
  console.log('Request to Github made')
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
  const sha = req.body.sha || undefined
  res.status(200).json(await createUpdate(ref, path, content, message, sha))
  return
}
