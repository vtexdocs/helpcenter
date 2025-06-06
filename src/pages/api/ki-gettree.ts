import { NextApiRequest, NextApiResponse } from 'next'
import octokit from 'utils/octokitConfig'

async function getGithubTree(org: string, repo: string, ref: string) {
  const response = octokit.request(
    'GET /repos/{org}/{repo}/git/trees/{ref}?recursive=true',
    {
      org: org,
      repo: repo,
      ref: ref,
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
  res.status(200).json(await getGithubTree('vtexdocs', 'known-issues', 'main'))
  return
}
