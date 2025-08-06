import { ContributorsType } from './getFileContributors'

interface GitHubUser {
  id: string
  login: string
  primaryAvatarUrl: string
  profileLink: string
}

export const fetchFileContributors = async (
  branch: string,
  path: string
): Promise<ContributorsType[]> => {
  try {
    const res = await fetch(
      `https://github.com/vtexdocs/help-center-content/file-contributors/${branch}/${path}`,
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
