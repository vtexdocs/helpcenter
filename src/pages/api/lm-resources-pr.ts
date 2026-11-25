import { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import octokit from 'utils/octokitConfig'

const OWNER = 'vtexdocs'
const REPO = 'help-center-content'
const BASE_BRANCH = 'main'
const TARGET_PATH = 'data-tables'
const ALLOWED_FILES = [
  'license-manager-resources.json',
  'license-manager-internal-resources.json',
]

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}

function isValidKey(provided: string | undefined) {
  const expected = process.env.LM_RESOURCES_PR_KEY
  if (!expected || !provided) return false
  const expectedBuffer = new TextEncoder().encode(expected)
  const providedBuffer = new TextEncoder().encode(provided)
  if (expectedBuffer.length !== providedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, providedBuffer)
}

async function getFileSha(path: string, ref: string) {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      { owner: OWNER, repo: REPO, path, ref }
    )
    return response.data.sha as string
  } catch (error) {
    // The file does not exist on the branch yet, so it will be created
    if ((error as { status?: number }).status === 404) return undefined
    throw error
  }
}

async function openResourcesPullRequest(
  files: Record<string, string>,
  reviewers: string[]
) {
  const baseResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/git/ref/heads/{ref}',
    { owner: OWNER, repo: REPO, ref: BASE_BRANCH }
  )
  const baseSha = baseResponse.data.object.sha

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..*/, '')
  const branch = `update-lm-resources-${timestamp}`

  await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${branch}`,
    sha: baseSha,
  })

  for (const [fileName, content] of Object.entries(files)) {
    const path = `${TARGET_PATH}/${fileName}`
    const sha = await getFileSha(path, branch)
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: OWNER,
      repo: REPO,
      path,
      message: `chore: update License Manager resources (${fileName})`,
      branch,
      sha,
      content: Buffer.from(content, 'utf8').toString('base64'),
    })
  }

  const pr = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner: OWNER,
    repo: REPO,
    title: 'chore: update License Manager resources',
    head: branch,
    base: BASE_BRANCH,
    body: `Updates the License Manager resources tables.\n\nFiles: ${Object.keys(
      files
    )
      .map((fileName) => `\`${TARGET_PATH}/${fileName}\``)
      .join(', ')}`,
  })

  if (reviewers.length > 0) {
    await octokit.request(
      'POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers',
      { owner: OWNER, repo: REPO, pull_number: pr.data.number, reviewers }
    )
  }

  return pr.data.html_url as string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  if (!isValidKey(req.headers['x-lm-resources-key'] as string | undefined)) {
    res.status(401).end()
    return
  }

  const files: Record<string, string> = {}
  const body = req.body || {}

  const reviewers = body.reviewers ?? []
  if (
    !Array.isArray(reviewers) ||
    !reviewers.every((reviewer) => typeof reviewer === 'string')
  ) {
    res
      .status(400)
      .json({ error: 'reviewers must be an array of GitHub logins' })
    return
  }

  for (const fileName of ALLOWED_FILES) {
    const content = body[fileName]
    if (typeof content !== 'string') {
      res.status(400).json({ error: `Missing ${fileName}` })
      return
    }
    try {
      JSON.parse(content)
    } catch {
      res.status(400).json({ error: `${fileName} is not valid JSON` })
      return
    }
    files[fileName] = content
  }

  try {
    const prUrl = await openResourcesPullRequest(files, reviewers)
    res.status(201).json({ prUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to open License Manager resources PR:', message)
    res.status(502).json({ error: message })
  }
}
