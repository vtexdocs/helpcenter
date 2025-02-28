export const removeHTML = (str: string) => str.replace(/<\/?[^>]+>/g, '')

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toCamelCase = (str: string) => {
  const [firstWord, ...otherWords] = str.split('-')
  return `${firstWord}${otherWords.map(capitalizeFirstLetter).join('')}`
}

export const slugify = (str: string) => {
  return str
    .normalize('NFD') // Decomposes diacritics (e.g., "é" → "é")
    .replace(/[\u0300-\u036f]/g, '') // Removes diacritic marks
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Removes non-word characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replaces spaces with hyphens
    .replace(/-+/g, '-') // Removes multiple consecutive hyphens
    .trim() // Trims leading/trailing spaces
}

type Child = string | { props: { children: Child[] } }

export const childrenToString: (children: Child[]) => string = (children) => {
  if (!children) return ''
  else if (Array.isArray(children))
    return children
      .map((child) => {
        if (typeof child === 'string') return child
        return childrenToString(child.props.children)
      })
      .join('')
  else {
    if (typeof children === 'string') return children
    return childrenToString(children['props']['children'])
  }
}

export const matrixToMarkdownTable: (matrix: string[][]) => string = (
  matrix
) => {
  const matrixRowToMarkdownTableRow = (matrixRow: string[]) =>
    `|${matrixRow
      .map((matrixElement) => ` ${matrixElement.replace(/\n/g, '<br />')} |`)
      .join('')}`

  let table = matrixRowToMarkdownTableRow(matrix[0]) + '\n|'
  for (let i = 0; i < matrix[0].length; i++) table += ' --- |'

  table += '\n'
  for (let i = 1; i < matrix.length; i++)
    table += matrixRowToMarkdownTableRow(matrix[i]) + '\n'

  return table
}
