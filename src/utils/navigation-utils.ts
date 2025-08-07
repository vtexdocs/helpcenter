export const flattenJSON = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: any = {},
  extraKey = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  for (const key in obj) {
    if (typeof obj[key] !== 'object') {
      res[extraKey + key] = obj[key]
    } else {
      flattenJSON(obj[key], res, `${extraKey}${key}.`)
    }
  }
  return res
}
export const getKeyByValue = (
  object: { [x: string]: string },
  value: string
) => {
  return Object.keys(object).find((key) => object[key] === value)
}

export const getKeysByValue = (
  object: { [x: string]: string },
  value: string
) => {
  return Object.keys(object).filter((key) => object[key] === value)
}

export type localeType = 'en' | 'pt' | 'es'

export const getParents = (
  path: string,
  data: string,
  flattenedSidebar: { [x: string]: string },
  locale: localeType = 'en',
  parentsArray: string[],
  parent?: string
) => {
  const pathParts = path?.split('children')
  const desiredData =
    data === 'name' || data === 'slug' ? `${data}.${locale}` : data
  pathParts?.splice(-1)
  let prev = ''
  pathParts?.map((el) => {
    el = prev + el
    prev = el + 'children'

    const localizedData = flattenedSidebar[`${el}${desiredData}`]
    const unlocalizedData = flattenedSidebar[`${el}${data}`]
    if (
      localizedData &&
      (!parent || (localizedData && localizedData.includes(parent)))
    ) {
      parentsArray.push(localizedData)
    } else if (unlocalizedData) {
      parentsArray.push(unlocalizedData)
    }
  })

  return parentsArray
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChildren = (
  path: string,
  data: string,
  flattenedSidebar: { [x: string]: string },
  locale: localeType = 'en',
  childrenArray: string[] = []
): string[] => {
  const childrenBasePath = path?.split('slug')[0] + 'children.'
  const desiredData = locale ? `${data}.${locale}` : data

  for (let i = 0; i < 100; i++) {
    const completePath = `${childrenBasePath}${i}.${desiredData}`
    const value = flattenedSidebar[completePath]
    if (!value) break
    childrenArray.push(value)
  }

  return childrenArray
}

export const getArticleParentsArray = (
  keyPath: string,
  flattenedSidebar: { [x: string]: string },
  currentLocale: localeType = 'en',
  slug: string
): string[] => {
  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []

  const pushSanitizedParents = (
    key: string,
    array: string[],
    pathSuffix: string
  ) => {
    getParents(keyPath, key, flattenedSidebar, currentLocale, array)
    const keyPathWithSuffix = keyPath.split('slug')[0].concat(pathSuffix)
    array.push(flattenedSidebar[keyPathWithSuffix] ?? null)
  }

  getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
  parentsArray.push(slug)

  const sanitizedParentsArray = parentsArray.filter(
    (item) => item !== null && item !== undefined
  )

  pushSanitizedParents('name', parentsArrayName, `name.${currentLocale}`)
  pushSanitizedParents('type', parentsArrayType, 'type')

  return sanitizedParentsArray
}
