import { QueryBuilder } from '../../shared/lib/QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import { GetRequest } from './GetRequest'
import { populateStore } from './populateStore'

export type CenterGraphOptions = {
  base: string
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()

  constructor(options: CenterGraphOptions) {
    this.#options = options
  }

  populateStore() {
    return populateStore(this.#store)
  }

  get(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new GetRequest(url)
  }

  get query() {
    return new QueryBuilder({
      base: this.#options.base,
      mode: 'remote',
      store: this.#store,
    })
  }
}
