import { Request, Response } from 'express'

import { prefixes } from '../Base.ts'

export const context = async (request: Request, response: Response) => {
  response.send({
    '@context': { prefixes },
  })
}
