import type { NextApiRequest, NextApiResponse } from 'next'
import { solve } from '@/solver'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { examples, input } = req.body
  res.status(200).json(await solve(examples, input))
}
