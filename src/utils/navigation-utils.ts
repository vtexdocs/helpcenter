import { LoggerType } from './logging/log-util'

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

const filterSlugs = (obj: { [key: string]: string }) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key.includes('.slug'))
  )
}

export const getKeyByValue = (
  object: { [x: string]: string },
  value: string
) => {
  const slugsObject = filterSlugs(object)
  return Object.keys(slugsObject).find((key) => object[key] === value)
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
      localizedData !== undefined &&
      (!parent || (localizedData && localizedData.includes(parent)))
    ) {
      parentsArray.push(localizedData)
    } else if (unlocalizedData !== undefined) {
      parentsArray.push(unlocalizedData)
    } else {
      // Log when both localized and unlocalized data are undefined
      console.warn(
        `getParents: Both localizedData (${el}${desiredData}) and unlocalizedData (${el}${data}) are undefined for path: ${path}`
      )
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
  const desiredData = `${data}.${locale}`

  for (let i = 0; i < 100; i++) {
    const completePath = `${childrenBasePath}${i}.${desiredData}`
    let value = flattenedSidebar[completePath]
    if (value == undefined) {
      value = flattenedSidebar[`${childrenBasePath}${i}.${data}`]
    }
    if (!value) {
      // Log if we're breaking due to undefined/null/empty value
      if (i === 0) {
        console.warn(
          `getChildren: No children found for path: ${path}, data: ${data}, locale: ${locale}`
        )
      }
      break
    }
    // Only push non-undefined values to avoid serialization issues
    if (value !== undefined) {
      childrenArray.push(value)
    }
  }

  return childrenArray
}

function safePush<T>(
  arr: T[],
  value: T | undefined,
  onWarn?: (msg: string) => void,
  warnMsg?: string
) {
  if (value !== undefined) arr.push(value)
  else if (onWarn && warnMsg) onWarn(warnMsg)
}

export function computeParents(
  keyPath: string,
  flattenedSidebar: { [x: string]: string },
  currentLocale: localeType,
  logger: LoggerType
) {
  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []

  const mainKeyPath = keyPath.split('slug')[0]
  const localizedSlugKey = `${mainKeyPath}slug.${currentLocale}`
  const nameKeyPath = `${mainKeyPath}name.${currentLocale}`
  const typeKey = `${mainKeyPath}type`

  // These mutate via provided utils to walk the tree
  getParents(keyPath, 'name', flattenedSidebar, currentLocale, parentsArrayName)
  getParents(
    `${mainKeyPath}slug.${currentLocale}`,
    'slug',
    flattenedSidebar,
    currentLocale,
    parentsArray
  )

  const localizedSlug = flattenedSidebar[localizedSlugKey]
  if (localizedSlug === undefined) {
    logger.warn(`localizedSlug is undefined for keyPath: ${localizedSlugKey}`)
  }
  safePush(parentsArray, localizedSlug)

  const categoryTitle = flattenedSidebar[nameKeyPath]
  if (categoryTitle === undefined) {
    logger.warn(`categoryTitle is undefined for keyPath: ${nameKeyPath}`)
  }
  safePush(parentsArrayName, categoryTitle)

  const typeValue = flattenedSidebar[typeKey]
  if (typeValue === undefined) {
    logger.warn(`typeValue is undefined for keyPath: ${typeKey}`)
  }
  safePush(parentsArrayType, typeValue)

  return { parentsArray, parentsArrayName, parentsArrayType, categoryTitle }
}
