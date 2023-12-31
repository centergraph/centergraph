import { nest } from '@shared/jsonLdNester.ts'
import jsonld from 'jsonld'
import { DataFactory, Store } from 'n3'
import { NextFunction, Request, Response } from 'types-express'

import { writeTurtle } from '../../../turtle-sync/src/helpers/writeTurtle.ts'
import { baseIRI, prefixes, store } from '../Base.ts'

export const turtle = async (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname

  const asJSON = !!fullUrl.searchParams.get('asJSON')

  const quads = store
    .getQuads(null, null, null, DataFactory.namedNode(iri))
    .map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object))
  if (!quads.length) return next()

  if (asJSON) {
    const document = await jsonld.fromRDF(quads)
    const compacted = await jsonld.compact(document, {
      '@context': {
        shape: 'sh:shapesGraph',
        // id: '@id',
        '@vocab': 'https://schema.org/', // Can be grabbed maybe from the original turtle?
        ...prefixes,
      },
    })
    const nestedDocument = nest(compacted)?.[0]
    delete nestedDocument['@id']
    response.send(nestedDocument)
  } else {D
    const writeStore = new Store(quads)
    const outputTurtle = await writeTurtle({ store: writeStore, prefixes })
    response.set('Content-Type', 'text/turtle')
    response.send(outputTurtle)
  }
}
