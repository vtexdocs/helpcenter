import { FeedbackSection as FeedbackSectionComponent } from '@vtexdocs/components'
import { SectionId } from 'utils/typings/unionTypes'

const DEFAULT_REPO = 'help-center-content'

function getRepoForSection(type?: SectionId): string {
  return type === 'known-issues' ? 'known-issues' : DEFAULT_REPO
}

interface DocPath {
  slug?: string
  docPath?: string
  suggestEdits?: boolean
  type?: SectionId
}

const FeedbackSection = ({
  slug,
  docPath,
  suggestEdits = true,
  type,
}: DocPath) => {
  const sendFeedback = async (liked: boolean) => {
    const feedback = {
      data: [
        new Date().toISOString(),
        `https://help.vtex.com/docs/tutorials/${slug}`,
        liked ? 'positive' : 'negative',
        '',
      ],
    }

    await fetch('/api/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedback),
    })
  }

  const contentRepo = getRepoForSection(type)
  const urlToEdit = docPath
    ? `https://github.com/vtexdocs/${contentRepo}/edit/main/${docPath}`
    : ''

  return (
    <FeedbackSectionComponent
      sendFeedback={sendFeedback}
      urlToEdit={urlToEdit}
      suggestEdits={suggestEdits}
      slug={slug}
    />
  )
}

export default FeedbackSection
