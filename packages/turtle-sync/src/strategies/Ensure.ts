import { writeTurtle } from '@centergraph/shared/lib/writeTurtle.ts'

import { DataFactory } from '../deps.ts'
import { StrategyProps } from '../types.ts'

export default async ({ graphStore, iri, store, sparqlEndpoint, fetch }: StrategyProps) => {
  if (sparqlEndpoint) {
    const askSparqlQuery = `ASK WHERE { GRAPH <${iri}> { ?s ?p ?o } }`
    const response = await fetch(sparqlEndpoint, {
      method: 'POST',
      body: askSparqlQuery,
      headers: { 'content-type': 'application/sparql-query' },
    }).then((response) => response.json())

    if (response.boolean) return

    const turtle = await writeTurtle({ store: graphStore })
    const insertSparqlQuery = `INSERT DATA { GRAPH <${iri}> { ${turtle} } }`
    await fetch(sparqlEndpoint, {
      method: 'POST',
      body: insertSparqlQuery,
      headers: { 'content-type': 'application/sparql-update' },
    }).then((response) => response.text())
  }

  if (store) {
    const graph = store.match(null, null, null, DataFactory.namedNode(iri))
    if (!graph.size) {
      store.addQuads([...graphStore])
    }
  }
}
