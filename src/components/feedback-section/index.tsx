import { FeedbackSection as FeedbackSectionComponent } from '@vtexdocs/components'

interface DocPath {
  slug?: string
  docPath?: string
  suggestEdits?: boolean
  shareButton?: boolean
}

const FeedbackSection = ({
  slug,
  docPath,
  suggestEdits = true,
  shareButton = false,
}: DocPath) => {
  const sendFeedback = async (comment: string, liked: boolean) => {
    const feedback = {
      data: [
        new Date().toISOString(),
        `https://developers.vtex.com/docs/tutorial/${slug}`,
        liked ? 'positive' : 'negative',
        comment,
      ],
    }

    await fetch('/api/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedback),
    })
  }

  const urlToEdit = `https://github.com/vtexdocs/help-center-content/edit/main/${docPath}`

  return (
    <FeedbackSectionComponent
      sendFeedback={sendFeedback}
      urlToEdit={urlToEdit}
      suggestEdits={suggestEdits}
      slug={slug}
      shareButton={shareButton}
    />
  )
}

export default FeedbackSection
