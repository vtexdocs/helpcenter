import { useEffect, useState } from 'react'
import type { NavbarItem, NavigationData } from '../types/navigation'

/**
 * Client-side hook to load navigation data
 * Uses dynamic import to avoid bundling navigation in every page
 */
export function useClientNavigation() {
  const [navigation, setNavigation] = useState<NavbarItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setLoading(true)

        // Option 1: Dynamic import (preferred for static files)
        const navigationModule = (await import(
          '../../public/navigation.json'
        )) as NavigationData
        setNavigation(navigationModule.navbar)

        // Option 2: API call (alternative approach)
        // const response = await fetch('/api/navigation')
        // const data = await response.json()
        // setNavigation(data.navbar)
      } catch (err) {
        console.error('Failed to load navigation:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load navigation'
        )
      } finally {
        setLoading(false)
      }
    }

    loadNavigation()
  }, [])

  return { navigation, loading, error }
}

/**
 * Alternative: Load navigation data via API call
 * Useful if navigation needs to be fetched from external source
 */
export function useClientNavigationAPI() {
  const [navigation, setNavigation] = useState<NavbarItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setLoading(true)
        const response = await fetch('/navigation.json')
        const data = (await response.json()) as NavigationData
        setNavigation(data.navbar)
      } catch (err) {
        console.error('Failed to load navigation:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load navigation'
        )
      } finally {
        setLoading(false)
      }
    }

    loadNavigation()
  }, [])

  return { navigation, loading, error }
}
