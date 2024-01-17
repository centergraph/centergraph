import { NextFunction, Request, Response } from 'express'
import { DataFactory, Parser } from 'n3'

import { baseIRI, store } from '../../Base.ts'

export const handlePut = async (request: Request, _response: Response, _next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname
  const turtle = request.body

  if ([...store.getQuads(null, null, null, DataFactory.namedNode(iri))].length)
    throw new Error('Could not create as this graph already exists')

  const parser = new Parser({ baseIRI: iri })
  const quads = (await parser.parse(turtle)).map((quad) =>
    DataFactory.quad(quad.subject, quad.predicate, quad.object, DataFactory.namedNode(iri))
  )

  store.addQuads(quads)
}
