import { writeTurtle } from '@centergraph/shared/lib/writeTurtle.ts'

import { DataFactory } from '../deps.ts'
import { StrategyProps } from '../types.ts'

export default async ({ graphStore, iri, store, sparqlEndpoint, fetch }: StrategyProps) => {
  if (sparqlEndpoint) {
    const turtle = await writeTurtle({ store: graphStore })

    const sparqlQuery = `
      DROP GRAPH <${iri}> ;
      INSERT DATA { GRAPH <${iri}> { ${turtle} } }
    `

    await fetch(sparqlEndpoint, {
      method: 'POST',
      body: sparqlQuery,
      headers: {
        'content-type': 'application/sparql-update',
      },
    }).then((response) => response.text())
  }

  if (store) {
    const quadsToRemove = store.getQuads(null, null, null, DataFactory.namedNode(iri))
    store.removeQuads(quadsToRemove)
    store.addQuads([...graphStore])
  }
}
