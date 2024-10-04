import { Link, Flex, IconCaret, Text } from '@vtex/brand-ui'

import styles from './styles'

interface Props {
  breadcrumbList: { slug: string; name: string; type: string }[]
}

const Breadcrumb = ({ breadcrumbList }: Props) => {
  return (
    <Flex sx={styles.breadcrumb}>
      {breadcrumbList.map((item, idx) => (
        <>
          {item.type === 'markdown' ? (
            <Link sx={styles.breadcrumbItem} href={item.slug}>
              {item.name}
            </Link>
          ) : (
            <Text>{item.name}</Text>
          )}
          {idx < breadcrumbList.length - 1 ? (
            <IconCaret direction="right" size={16} />
          ) : null}
        </>
      ))}
    </Flex>
  )
}

export default Breadcrumb
