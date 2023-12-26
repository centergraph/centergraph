import { StrategyProps } from '../types.ts'
import { DataFactory } from '../deps.ts'

export default async ({ iri, store, sparqlEndpoint }: StrategyProps) => {
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
    store.removeMatches(null, null, null, DataFactory.namedNode(iri))
  }
}
