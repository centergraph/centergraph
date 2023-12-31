import { Request, Response } from 'express'

import { context as givenContext } from '../Base.ts'

export const context = async (request: Request, response: Response) => {
  response.send(givenContext)
}
