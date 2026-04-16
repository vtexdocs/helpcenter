import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AnnouncementDataElement } from 'utils/typings/types'

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementDataElement[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const locale = router.locale || 'en'
        const response = await fetch(`/api/announcements?locale=${locale}`)
        if (response.ok) {
          const data = await response.json()
          setAnnouncements(data.announcements || [])
        }
      } catch (error) {
        console.error('Error fetching announcements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [router.locale])

  return { announcements, isLoading }
}
