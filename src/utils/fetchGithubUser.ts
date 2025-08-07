import { ContributorsType } from 'utils/getFileContributors'
interface GitHubUserApiResponse {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export const fetchGitHubUser = async (
  login: string
): Promise<ContributorsType | null> => {
  try {
    const res = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!res.ok) {
      console.error(`GitHub user fetch failed: ${res.statusText}`)
      return null
    }

    const data: GitHubUserApiResponse = await res.json()

    return {
      name: data.name ?? data.login,
      login: data.login,
      avatar: data.avatar_url,
      userPage: data.html_url,
    }
  } catch (err) {
    console.error('Error fetching GitHub user:', err)
    return null
  }
}
