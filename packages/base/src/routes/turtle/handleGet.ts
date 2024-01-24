import { ldp, rdf } from '@centergraph/shared/lib/namespaces.ts'
import { writeTurtle } from '@centergraph/shared/lib/writeTurtle.ts'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { DataFactory, Quad, Store } from 'n3'

import { baseIRI, context, folder as dataFolder, store } from '../../Base.ts'

const getFolderQuads = async (folder: string, iri: string) => {
  const quads: Quad[] = []
  quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('Container')))
  quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('BasicContainer')))

  for await (const fileEntry of await fs.promises.readdir(folder)) {
    if (!fileEntry.includes('.ttl')) continue
    const newQuad = DataFactory.quad(
      DataFactory.namedNode(iri),
      ldp('contains'),
      DataFactory.namedNode(iri + fileEntry.replace('.ttl', ''))
    )
    quads.push(newQuad)
  }

  return quads
}

// TODO replace with abstraction that can do SPARQL and store.match
const getDocumentQuads = async (iri: string) => {
  const quads = store
    .getQuads(null, null, null, DataFactory.namedNode(iri))
    .map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object))

  return quads
}

export const handleGet = async (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname

  const quads = await getDocumentQuads(iri)

  if (!quads.length) {
    const folder = dataFolder + fullUrl.pathname
    try {
      const exists = fs.existsSync(folder)
      if (!exists) return next()
    } catch (error) {
      return next()
    }

    quads.push(...(await getFolderQuads(folder, iri)))
  }

  const writeStore = new Store(quads)
  const contextWithoutVocab = Object.assign({}, context)
  delete contextWithoutVocab['@vocab']
  const outputTurtle = await writeTurtle({ store: writeStore, prefixes: contextWithoutVocab })

  response.set('Content-Type', 'text/turtle')
  response.send(outputTurtle)
}
