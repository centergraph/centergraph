import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore, NamedNode, Term } from '@rdfjs/types'
import { DataFactory } from 'n3'
import df from '@rdfjs/data-model'
import { cg } from './namespaces'

export type QueryOptions = {
  base: string
  store: DatasetCore
  mode: 'local' | 'remote'
  asCount: boolean
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

export class QueryBuilder<T extends NamedNode[] | number> implements PromiseLike<T> {
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

  sort(predicate: Term, order: 'ascending' | 'descending' = 'ascending') {
    this.#sorters.push({ predicate, order })
    return this
  }

  paginate(limit?: number, offset?: number) {
    this.#paginate = { limit, offset }
    return this
  }

  fullTextSearch(search: string) {
    this.filter(cg('fullTextSearch'), df.literal(search))
    return this
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    try {
      if (this.#options.mode === 'local') return this.#thenStoreLocal().then(onfulfilled)
      return this.#thenApiRemote().then(onfulfilled)
    } catch (error) {
      return Promise.reject(onrejected ? onrejected(error) : undefined)
    }
  }

  async #thenStoreLocal(): Promise<T> {
    let dataset = this.#options.store

    for (const { predicate, object } of this.#filters) {
      let graphs: string[] = []

      if (predicate.equals(cg('fullTextSearch'))) {
        const searchTerm = object?.value.toLocaleLowerCase()
        if (!searchTerm) continue

        graphs = [...dataset]
          .filter(
            (quad) => quad.object.termType === 'Literal' && quad.object.value.toLocaleLowerCase().includes(searchTerm)
          )
          .map((quad) => quad.graph.value)
      } else {
        graphs = [...dataset.match(null, predicate, object)].map((quad) => quad.graph.value)
      }

      graphs = [...new Set(graphs)]

      dataset = datasetFactory.dataset()
      for (const graphIri of graphs) {
        const graphQuads = this.#options.store.match(null, null, null, df.namedNode(graphIri))
        for (const graphQuad of graphQuads) dataset.add(graphQuad)
      }
    }

    const quads = [...dataset]

    const graphs: Map<string, NamedNode> = new Map()
    for (const quad of quads) {
      graphs.set(quad.graph.value, quad.graph as unknown as NamedNode)
    }

    const graphNamedNodes = [...graphs.values()]

    if (this.#options.asCount) return graphNamedNodes.length as T

    return graphNamedNodes as T
  }

  get url() {
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
        asCount: this.#options.asCount,
      })
    )

    return `${this.#options.base}/api/query?${query.toString()}`
  }

  async #thenApiRemote(): Promise<T> {
    const response = await this.#fetch(this.url).then((response) => response.json())

    if (this.#options.asCount) return response.result

    return response.map((graph: string) => DataFactory.namedNode(graph))
  }

  // TODO Implement a to SPARQL method.
  // This is needed when CenterGraph is loaded with Apache Jena for example.
  // async #thenSparqlLocal(resolve: (results: NamedNode[]) => void) {}
}
