import { OctokitResponse } from '@octokit/types'

interface RequestResponse<T> extends OctokitResponse<T> {
  data: T
}

const octokit = {
  request: <T>(route: string): Promise<RequestResponse<T>> => {
    // Log route for debugging in tests
    console.log(`Mock Octokit request: ${route}`)
    return Promise.resolve({ data: {} as T } as RequestResponse<T>)
  },
}

export default octokit
