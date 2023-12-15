import { useRouter } from 'next/router'
import { Component } from 'react'
import FiveHundredPage from 'pages/500'

import { getLogger } from 'utils/logging/log-util'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error occur</h1>
    }

    return this.props.children
  }
}

export const SuspenseFallback = (branch) => {
  const { asPath } = useRouter()
  const logger = getLogger('Suspense Fallback')
  logger.error(`Error while processing ${asPath}`)

  return <FiveHundredPage branch={branch} />
}
