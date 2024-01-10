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
import { FolderApiRequest } from './FolderApiRequest'

export type CenterGraphOptions = {
  base: string
  shaclRendererSettings?: ShaclRendererProps['settings']
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()
  #d2LFetch: typeof D2LFetch
  #fetch: (typeof globalThis)['fetch']
  public shaclRendererSettings: ShaclRendererProps['settings']

  namespaces = namespaces

  constructor(options: CenterGraphOptions) {
    this.#options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })

    this.#fetch = (input, init) => ('Deno' in globalThis ? globalThis.fetch(input, init) : this.#d2LFetch.fetch(input, init))

    this.shaclRendererSettings = this.#options.shaclRendererSettings ?? defaultSettings('view')
    registerCoreWidgets(this.shaclRendererSettings)
    this.shaclRendererSettings.fetch = this.#fetch
  }

  populateStore() {
    return navigator.onLine ? populateStore(this.#store) : Promise.resolve(true)
  }

  get<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new GetApiRequest<T>(this.#fetch, this.#options.base, url)
  }

  getFolder(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new FolderApiRequest(this.#fetch, url)
  }

  get query() {
    return new QueryBuilder<NamedNode[]>({
      base: this.#options.base,
      asCount: false,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: this.#fetch,
    })
  }

  get count() {
    return new QueryBuilder<number>({
      base: this.#options.base,
      asCount: true,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: this.#fetch,
    })
  }

  centergraph = true
}
