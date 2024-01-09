// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    if (req.query.url) {
      await res.revalidate(req.query.url)
      return res.json({ revalidated: true })
    }
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
