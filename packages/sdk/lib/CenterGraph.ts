import { QueryBuilder } from '../../shared/lib/QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import { GetRequest } from './GetRequest'
import { populateStore } from './populateStore'

import { D2LFetch } from 'd2l-fetch'
// Only does inflight requests
import { fetchDedupe } from 'd2l-fetch-dedupe'
// Caches responses
import { fetchSimpleCache } from 'd2l-fetch-simple-cache'

export type CenterGraphOptions = {
  base: string
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()
  #d2LFetch: typeof D2LFetch

  constructor(options: CenterGraphOptions) {
    this.#options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })
  }

  populateStore() {
    return populateStore(this.#store)
  }

  get(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new GetRequest(url, (input, init) => this.#d2LFetch.fetch(input, init))
  }

  get query() {
    return new QueryBuilder({
      base: this.#options.base,
      mode: 'remote',
      store: this.#store,
      fetch: (input, init) => this.#d2LFetch.fetch(input, init),
    })
  }
}
