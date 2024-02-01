// import { enumerateNavigation } from './enumerate-navigation'

import navigationjson from '../../public/navigation.json'

export default async function getNavigation() {
  // const navigationJsonUrl = process.env.navigationJsonUrl
  // const result = await fetch(navigationJsonUrl as string)
  //   .then((res) => res.json())
  //   .then((res) => enumerateNavigation(res.navbar))
  // return result
  return navigationjson.navbar
}
