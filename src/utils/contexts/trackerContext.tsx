import { createContext, ReactNode } from 'react'

type ContextType = {
  startTracking: () => void
  initTracker: () => void
}

export const TrackerContext = createContext<ContextType>({
  startTracking: () => {
    // No-op: tracking disabled
  },
  initTracker: () => {
    // No-op: tracking disabled
  },
})

interface TrackerProviderProps {
  children: ReactNode
  config?: Record<string, unknown>
}

// Simplified tracker provider without OpenReplay
// Provides no-op functions to maintain component compatibility
export default function TrackerProvider({ children }: TrackerProviderProps) {
  const value = {
    startTracking: () => {
      // No-op: tracking disabled
    },
    initTracker: () => {
      // No-op: tracking disabled
    },
  }

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  )
}
