import { useEffect } from 'react'
import { Box } from '@vtex/brand-ui'
import dynamic from 'next/dynamic'
import { Item } from '@vtexdocs/components'

// Dynamic import for TableOfContents to avoid NextRouter mounting issues during SSG
const TableOfContents = dynamic(
  () =>
    import('@vtexdocs/components').then((mod) => ({
      default: mod.TableOfContents,
    })),
  { ssr: false }
)

interface Props {
  headingList?: Item[]
}

const TableOfContentsWrapper = ({ headingList }: Props) => {
  useEffect(() => {
    // Apply styles after component loads to fix horizontal layout issue
    const applyTableOfContentsStyles = () => {
      const tocElement = document.querySelector('[data-cy="table-of-contents"]')
      if (tocElement) {
        // Force vertical layout on main container
        ;(tocElement as HTMLElement).style.display = 'block'

        // Fix all child containers
        const childDivs = tocElement.querySelectorAll('div')
        childDivs.forEach((div) => {
          div.style.display = 'block'
          div.style.width = '100%'
        })

        // Fix all links
        const links = tocElement.querySelectorAll('a')
        links.forEach((link) => {
          link.style.display = 'block'
          link.style.width = '100%'
        })
      }
    }

    // Apply styles immediately
    applyTableOfContentsStyles()

    // Also apply styles after a short delay to catch any dynamic updates
    const timeoutId = setTimeout(applyTableOfContentsStyles, 100)

    // Set up a mutation observer to reapply styles if DOM changes
    const observer = new MutationObserver(applyTableOfContentsStyles)
    const targetNode = document.querySelector('[data-cy="table-of-contents"]')

    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])

  return (
    <Box
      sx={{
        // Container styles to ensure vertical layout
        display: 'block !important',
        '& [data-cy="table-of-contents"]': {
          display: 'block !important',
        },
        '& [data-cy="table-of-contents"] > div': {
          display: 'block !important',
          width: '100% !important',
        },
        '& [data-cy="table-of-contents"] a': {
          display: 'block !important',
          width: '100% !important',
        },
        '& [data-cy="table-of-contents"] *': {
          flexDirection: 'column !important',
        },
      }}
    >
      <TableOfContents headingList={headingList} />
    </Box>
  )
}

export default TableOfContentsWrapper
