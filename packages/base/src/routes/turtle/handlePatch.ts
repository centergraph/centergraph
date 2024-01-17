import { NextFunction, Request, Response } from 'express'
import { DataFactory, Parser } from 'n3'

import { baseIRI, store } from '../../Base.ts'

export const handlePatch = async (request: Request, _response: Response, _next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname
  const turtle = request.body
  const parser = new Parser({ baseIRI: iri })
  const quads = (await parser.parse(turtle)).map((quad) =>
    DataFactory.quad(quad.subject, quad.predicate, quad.object, DataFactory.namedNode(iri))
  )

  const oldQuads = store.getQuads(null, null, null, DataFactory.namedNode(iri))
  for (const oldQuad of oldQuads) store.removeQuad(oldQuad)

  store.addQuads(quads)
}
