import { ldp, rdf } from '@centergraph/shared/lib/namespaces.ts'
import { writeTurtle } from '@centergraph/shared/lib/writeTurtle.ts'
import { NextFunction, Request, Response } from 'express'
import { DataFactory, Parser, Quad, Store } from 'n3'

import { baseIRI, context, folder as dataFolder, store } from '../Base.ts'

const getFolderQuads = async (folder: string, iri: string) => {
  const quads: Quad[] = []
  quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('Container')))
  quads.push(DataFactory.quad(DataFactory.namedNode(iri), rdf('type'), ldp('BasicContainer')))

  for await (const fileEntry of Deno.readDir(folder)) {
    if (!fileEntry.name.includes('.ttl')) continue
    quads.push(DataFactory.quad(DataFactory.namedNode(iri), ldp('contains'), DataFactory.namedNode(iri)))
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

const handlePatch = async (request: Request) => {
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

export const handleGet = async (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname

  const quads = await getDocumentQuads(iri)
  if (!quads.length) {
    const folder = dataFolder + fullUrl.pathname
    try {
      const stat = await Deno.stat(folder)
      if (!stat.isDirectory) return next()
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

export const handleDelete = async (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = new URL(baseIRI + request.url)
  const iri = baseIRI + fullUrl.pathname
  const oldQuads = store.getQuads(null, null, null, DataFactory.namedNode(iri))
  for (const oldQuad of oldQuads) store.removeQuad(oldQuad)

  response.status(204).send()
}

export const turtle = async (request: Request, response: Response, next: NextFunction) => {
  if (request.method === 'PATCH') {
    await handlePatch(request)
    return handleGet(request, response, next)
  } else if (['GET', 'OPTIONS', 'HEAD'].includes(request.method)) {
    return handleGet(request, response, next)
  } else if (request.method === 'DELETE') {
    return handleDelete(request, response, next)
  }

  throw new Error('Unhandled method')
}
