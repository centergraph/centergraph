import type { DatasetCore, NamedNode, Quad, Term } from '@rdfjs/types'
import datasetFactory from '@rdfjs/dataset'

export type QueryOptions = {
  base: string
  store: DatasetCore
}

export class QueryBuilder {
  #options: QueryOptions
  #filters: Array<{ predicate: NamedNode; object?: Term }> = []

  constructor(options: QueryOptions) {
    this.#options = options
  }

  filter(predicate: NamedNode, object?: Term) {
    this.#filters.push({ predicate, object })
    return this
  }

  sort(predicate: NamedNode, order: 'ascending' | 'descending') {}

  paginate(limit: number, offset: number) {}

  then(resolve: (results: NamedNode[]) => void) {
    let dataset = this.#options.store

    for (const { predicate, object } of this.#filters) {
      const quads = dataset.match(null, predicate, object)
      dataset = datasetFactory.dataset()
      for (const quad of quads) {
        const graphQuads = this.#options.store.match(null, null, null, quad.graph)
        for (const graphQuad of graphQuads) dataset.add(graphQuad)
      }
    }

    const quads = [...dataset]

    const graphs: Map<string, NamedNode> = new Map()
    for (const quad of quads) {
      graphs.set(quad.graph.value, quad.graph as unknown as NamedNode)
    }

    resolve([...graphs.values()])
  }
}
