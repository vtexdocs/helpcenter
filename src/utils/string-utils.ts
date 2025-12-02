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
