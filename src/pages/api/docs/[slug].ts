// import { getAllDocsPaths } from 'utils/getDocsPaths'

// const allPaths = await getAllDocsPaths()
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { slug, language, path }: { [key: string]: string } = req.query
  const docCategory = path.split('/')[1]
  let doc = ''

  if (docCategory === 'tutorials') {
    doc = 'docs/tutorial'
  } else if (docCategory === 'tracks') {
    doc = 'docs/tracks'
  } else {
    doc = docCategory
  }

  const url = `/${language ? `${language}/` : ''}${doc}/${slug}`
  res.redirect(307, url)
}
