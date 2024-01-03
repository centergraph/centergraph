import { ldp, rdf } from '@centergraph/shared/lib/namespaces.ts'
import { writeTurtle } from '@centergraph/shared/lib/writeTurtle.ts'
import { DataFactory, Store } from 'n3'
import { NextFunction, Request, Response } from 'types-express'

import { baseIRI, context, folder as dataFolder, store } from '../Base.ts'

export const turtle = async (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname

  const quads = store
    .getQuads(null, null, null, DataFactory.namedNode(iri))
    .map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object))

  if (!quads.length) {
    const folder = dataFolder + fullUrl.pathname

    try {
      await Deno.stat(folder)
    } catch (error) {
      return next()
    }

    quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('Container')))
    quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('BasicContainer')))

    for await (const fileEntry of Deno.readDir(folder)) {
      if (!fileEntry.name.includes('.ttl')) continue
      const uri = baseIRI + fullUrl.pathname + fileEntry.name.replace('.ttl', '')
      quads.push(DataFactory.quad(DataFactory.namedNode(iri), ldp('contains'), DataFactory.namedNode(uri)))
    }
  }

  const writeStore = new Store(quads)
  const contextWithoutVocab = Object.assign({}, context)
  delete contextWithoutVocab['@vocab']
  const outputTurtle = await writeTurtle({ store: writeStore, prefixes: contextWithoutVocab })

  response.set('Content-Type', 'text/turtle')
  response.send(outputTurtle)
}
