import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore, NamedNode, Term } from '@rdfjs/types'
import { DataFactory } from 'n3'

export type QueryOptions = {
  base: string
  store: DatasetCore
  mode: 'local' | 'remote'
}

export class QueryBuilder {
  #options: QueryOptions
  #filters: { predicate: Term; object?: Term }[] = []
  #sorters: { predicate: Term; order: 'ascending' | 'descending' }[] = []
  #paginate: { limit?: number; offset?: number } = {}

  constructor(options: QueryOptions) {
    this.#options = options
  }

  filter(predicate: Term, object?: Term) {
    this.#filters.push({ predicate, object })
    return this
  }

  sort(predicate: Term, order: 'ascending' | 'descending') {
    this.#sorters.push({ predicate, order })
    return this
  }

  paginate(limit?: number, offset?: number) {
    this.#paginate = { limit, offset }
    return this
  }

  then(resolve: (results: NamedNode[]) => void) {
    if (this.#options.mode === 'local') return this.thenLocal(resolve)
    return this.thenRemote(resolve)
  }

  thenLocal(resolve: (results: NamedNode[]) => void) {
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

  async thenRemote(resolve: (results: NamedNode[]) => void) {
    const query = new URLSearchParams()
    query.append(
      'query',
      JSON.stringify({
        filters: this.#filters.map((filter) => ({ predicate: filter.predicate.value, object: filter.object?.value })),
        sorters: this.#sorters.map((sorter) => ({ predicate: sorter.predicate.value, order: sorter.order })),
        paginate: this.#paginate,
      })
    )
    const response = await fetch(`${this.#options.base}/api/query?${query.toString()}`).then((response) => response.json())
    const graphs = response.map((graph: string) => DataFactory.namedNode(graph))
    resolve(graphs)
  }
}
