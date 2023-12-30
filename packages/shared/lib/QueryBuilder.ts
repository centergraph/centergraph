import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore, NamedNode, Term } from '@rdfjs/types'
import { DataFactory } from 'n3'

export type QueryOptions = {
  base: string
  store: DatasetCore
  mode: 'local' | 'remote'
  fetch?: (typeof globalThis)['fetch']
}

const flatten = (obj: Term) => {
  const result = Object.create(obj)
  for (const key in result) {
    // eslint-disable-next-line no-self-assign
    result[key] = result[key]
  }
  return result
}

export class QueryBuilder {
  #options: QueryOptions
  #filters: { predicate: Term; object?: Term }[] = []
  #sorters: { predicate: Term; order: 'ascending' | 'descending' }[] = []
  #paginate: { limit?: number; offset?: number } = {}
  #fetch: (typeof globalThis)['fetch']

  constructor(options: QueryOptions) {
    this.#options = options
    this.#fetch = options.fetch ?? globalThis.fetch
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
    if (this.#options.mode === 'local') return this.thenStoreLocal(resolve)
    return this.thenApiRemote(resolve)
  }

  thenStoreLocal(resolve: (results: NamedNode[]) => void) {
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

  async thenApiRemote(resolve: (results: NamedNode[]) => void) {
    const query = new URLSearchParams()
    query.append(
      'query',
      JSON.stringify({
        filters: this.#filters.map((filter) => ({
          predicate: flatten(filter.predicate),
          object: filter.object ? flatten(filter.object) : undefined,
        })),
        sorters: this.#sorters.map((sorter) => ({ predicate: flatten(sorter.predicate), order: sorter.order })),
        paginate: this.#paginate,
      })
    )
    const response = await this.#fetch(`${this.#options.base}/api/query?${query.toString()}`).then((response) => response.json())
    const graphs = response.map((graph: string) => DataFactory.namedNode(graph))
    resolve(graphs)
  }
}
