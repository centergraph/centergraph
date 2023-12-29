import { DataFactory } from '../deps.ts'
import { StrategyProps } from '../types.ts'

export default async ({ iri, store, sparqlEndpoint, fetch }: StrategyProps) => {
  if (sparqlEndpoint) {
    const sparqlQuery = `
      DROP GRAPH <${iri}>
    `

    await fetch(sparqlEndpoint, {
      method: 'POST',
      body: sparqlQuery,
      headers: {
        'content-type': 'application/sparql-update',
      },
    })
  }

  if (store) {
    const quadsToRemove = store.getQuads(null, null, null, DataFactory.namedNode(iri))
    store.removeQuads(quadsToRemove)
  }
}
