import { ContributorsType } from './getFileContributors'

interface GitHubUser {
  id: string
  login: string
  primaryAvatarUrl: string
  profileLink: string
}

export const fetchFileContributors = async (
  section: string,
  branch: string,
  path: string
): Promise<ContributorsType[]> => {
  const repo =
    section === 'known-issues' ? 'known-issues' : 'help-center-content'
  try {
    const res = await fetch(
      `https://github.com/vtexdocs/${repo}/file-contributors/${branch}/${path}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
    const { users } = await res.json()

    return users
      .filter((user: GitHubUser) => user.id !== '41898282')
      .map((user: GitHubUser) => ({
        name: user.login,
        login: user.login,
        avatar: user.primaryAvatarUrl,
        userPage: `https://github.com${user.profileLink}`,
      }))
  } catch (err) {
    console.error('Error fetching contributors:', err)
    return []
  }
}
