import { NextFunction, Request, Response } from 'express'

import { handleDelete } from './turtle/handleDelete.ts'
import { handleGet } from './turtle/handleGet.ts'
import { handlePatch } from './turtle/handlePatch.ts'
import { handlePut } from './turtle/handlePut.ts'

export const turtle = async (request: Request, response: Response, next: NextFunction) => {
  if (request.method === 'PATCH') {
    await handlePatch(request, response, next)
    return handleGet(request, response, next)
  } else if (['GET', 'OPTIONS', 'HEAD'].includes(request.method)) {
    return handleGet(request, response, next)
  } else if (request.method === 'DELETE') {
    return handleDelete(request, response, next)
  } else if (request.method === 'PUT') {
    await handlePut(request, response, next)
    return handleGet(request, response, next)
  }

  throw new Error('Unhandled method')
}
