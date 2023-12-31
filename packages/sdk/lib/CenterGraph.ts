import { QueryBuilder } from '@centergraph/shared/QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import { Loader } from './Loader'
import { populateStore } from './populateStore'

import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { fetchSimpleCache } from 'd2l-fetch-simple-cache'
import { useEffect, useState } from 'react'

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

  load<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new Loader<T>(url, this.#options.base, (input, init) => this.#d2LFetch.fetch(input, init))
  }

  get documentUrls() {
    return new QueryBuilder({
      base: this.#options.base,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: (input, init) => this.#d2LFetch.fetch(input, init),
    })
  }

  /**
   * A React hook which makes it easy to first get an empty array and then re-render when NamedNodes are available
   */
  get useDocumentUrls() {
    return (queryCallback: (query: QueryBuilder) => QueryBuilder): NamedNode[] => {
      const [urls, setUrls] = useState<NamedNode[]>([])

      useEffect(() => {
        queryCallback(this.documentUrls).then(setUrls)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return urls
    }
  }
}
