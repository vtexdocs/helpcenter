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
  childrenArray: string[]
) => {
  const childrenBasePath = path?.split('slug')[0].concat('children.')
  const desiredData = data === 'name' ? `${data}.${locale}` : data

  for (let i = 0; i < 100; i++) {
    const completePath = childrenBasePath
      .concat(String(i))
      .concat(`.${desiredData}`)
    if (!flattenedSidebar[completePath]) {
      break
    }
    childrenArray.push(flattenedSidebar[completePath])
  }

  return childrenArray
}
