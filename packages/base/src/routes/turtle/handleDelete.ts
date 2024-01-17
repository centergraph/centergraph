import { NextFunction, Request, Response } from 'express'
import { DataFactory } from 'n3'

import { baseIRI, store } from '../../Base.ts'

export const handleDelete = async (request: Request, response: Response, _next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname
  const oldQuads = store.getQuads(null, null, null, DataFactory.namedNode(iri))
  for (const oldQuad of oldQuads) store.removeQuad(oldQuad)

  response.status(204).send()
}
