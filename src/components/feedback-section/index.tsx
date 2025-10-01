import { FeedbackSection as FeedbackSectionComponent } from '@vtexdocs/components'

interface DocPath {
  slug?: string
  docPath?: string
  suggestEdits?: boolean
  small?: boolean
}

const FeedbackSection = ({
  slug,
  docPath,
  suggestEdits = true,
  small = false,
}: DocPath) => {
  const sendFeedback = async (comment: string, liked: boolean) => {
    const feedback = {
      data: [
        new Date().toISOString(),
        `https://help.vtex.com/docs/tutorials/${slug}`,
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
      small={small}
    />
  )
}

export default FeedbackSection
