export default async function redirectToLocalizedUrl(
  keyPath: string,
  locale: 'en' | 'es' | 'pt',
  flattenedSidebar: Record<string, string>,
  docType:
    | 'tutorials'
    | 'tracks'
    | 'announcements'
    | 'faq'
    | 'known-issues'
    | 'troubleshooting'
) {
  const keypathLocale = keyPath.split('slug.')[1]

  if (!(locale === keypathLocale)) {
    const keyPathWithoutLocale = keyPath.split('.slug')[0]
    const localizedSlug =
      flattenedSidebar[`${keyPathWithoutLocale}.slug.${locale}`]
    if (localizedSlug) {
      const docTypePath = getDocTypePath(docType)
      return {
        redirect: {
          destination: `/${locale}/${docTypePath}/${localizedSlug}`,
          permanent: true,
        },
      }
    } else {
      return {
        notFound: true,
      }
    }
  } else {
    return {
      notFound: true,
    }
  }
}

function getDocTypePath(
  docType:
    | 'tutorials'
    | 'tracks'
    | 'announcements'
    | 'faq'
    | 'known-issues'
    | 'troubleshooting'
) {
  switch (docType) {
    case 'tutorials':
      return 'docs/tutorials'
    case 'tracks':
      return 'docs/tracks'
    case 'announcements':
      return 'announcements'
    case 'faq':
      return 'faq'
    case 'known-issues':
      return 'known-issues'
    case 'troubleshooting':
      return 'troubleshooting'
  }
}
