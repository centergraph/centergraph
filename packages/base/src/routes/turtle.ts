import { DataFactory, Store } from 'n3'
import { Context } from 'oak'

import { writeTurtle } from '../../../turtle-sync/src/helpers/writeTurtle.ts'
import { baseIRI, prefixes, store } from '../Base.ts'

export const turtle = async (context: Context, next: () => Promise<unknown>) => {
  const iri = baseIRI + context.request.url.pathname
  const quads = store
    .getQuads(null, null, null, DataFactory.namedNode(iri))
    .map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object))
  if (!quads.length) return next()

  const writeStore = new Store(quads)

  const outputTurtle = await writeTurtle({ store: writeStore, prefixes })

  if (!context.request.accepts('text/html')) {
    context.response.headers.set('Content-Type', 'text/turtle')
  }

  context.response.body = outputTurtle
}
