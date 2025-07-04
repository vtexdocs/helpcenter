import { Flex, IconCaret, Text } from '@vtex/brand-ui'
import Link from 'next/link'

import styles from './styles'

interface Props {
  breadcrumbList: { slug: string; name: string; type: string }[]
}

const Breadcrumb = ({ breadcrumbList }: Props) => {
  return (
    <Flex sx={styles.breadcrumb}>
      {breadcrumbList.map((item, idx) => (
        <Flex
          key={`breadcrumb-${idx}-${item.slug}`}
          sx={{ alignItems: 'center' }}
        >
          {item.type === 'markdown' ? (
            <Link href={item.slug}>
              <Text sx={styles.breadcrumbItem}>{item.name || 'Untitled'}</Text>
            </Link>
          ) : (
            <Text>{item.name || 'Untitled'}</Text>
          )}
          {idx < breadcrumbList.length - 1 ? (
            <IconCaret direction="right" size={16} />
          ) : null}
        </Flex>
      ))}
    </Flex>
  )
}

export default Breadcrumb
