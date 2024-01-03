import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import * as namespaces from '@centergraph/shared/lib/namespaces'
import { populateStore } from './populateStore'
import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { fetchSimpleCache } from 'd2l-fetch-simple-cache'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import type { ShaclRendererProps } from '@centergraph/shacl-renderer'
import { GetApiRequest } from './GetApiRequest'

export type CenterGraphOptions = {
  base: string
  viewSettings?: ShaclRendererProps['settings']
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()
  #d2LFetch: typeof D2LFetch
  viewSettings: ShaclRendererProps['settings']

  namespaces = namespaces

  constructor(options: CenterGraphOptions) {
    this.#options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })

    this.viewSettings = this.#options.viewSettings ?? defaultSettings('view')
    registerCoreWidgets(this.viewSettings)
    this.viewSettings.fetch = (input, init) => this.#d2LFetch.fetch(input, init)
  }

  populateStore() {
    return navigator.onLine ? populateStore(this.#store) : Promise.resolve()
  }

  get<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new GetApiRequest<T>((input, init) => this.#d2LFetch.fetch(input, init), this.#options.base, url)
  }

  get query() {
    return new QueryBuilder({
      base: this.#options.base,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: (input, init) => this.#d2LFetch.fetch(input, init),
    })
  }
}
