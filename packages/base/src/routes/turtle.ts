import { DataFactory, Store } from 'n3'
import { NextFunction, Request, Response } from 'types-express'

import { writeTurtle } from '../../../turtle-sync/src/helpers/writeTurtle.ts'
import { baseIRI, prefixes, store } from '../Base.ts'

export const turtle = async (request: Request, response: Response, next: NextFunction) => {
  const iri = baseIRI + request.url

  const quads = store
    .getQuads(null, null, null, DataFactory.namedNode(iri))
    .map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object))
  if (!quads.length) return next()

  const writeStore = new Store(quads)

  const outputTurtle = await writeTurtle({ store: writeStore, prefixes })
  response.set('Content-Type', 'text/turtle')
  response.send(outputTurtle)
}
