import datasetFactory from '@rdfjs/dataset'
import { DatasetCore, NamedNode } from '@rdfjs/types'
import * as namespaces from '@centergraph/shared/lib/namespaces'
import { populateStore } from './core/populateStore'
import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import type { ShaclRendererProps } from '@centergraph/shacl-renderer'
import { GetApiRequest } from './requests/GetApiRequest'
import { FolderApiRequest } from './requests/FolderApiRequest'
import { ResourceableQueryBuilder } from './requests/ResourceableQueryBuilder'
import { D2LFetchSimpleCache } from 'd2l-fetch-simple-cache/src/d2lfetch-simple-cache.js'
import { writeTurtle } from './core/writeTurtle'

export type CenterGraphOptions = {
  base: string
  shaclRendererSettings?: ShaclRendererProps['settings']
}

export const simpleCache = new D2LFetchSimpleCache()
export function fetchSimpleCache(...args: unknown[]) {
  return simpleCache.cache(...args)
}

export class CenterGraph {
  options: CenterGraphOptions
  #store = datasetFactory.dataset()
  #d2LFetch: typeof D2LFetch
  public shaclRendererSettings: ShaclRendererProps['settings']

  #fetch: (typeof globalThis)['fetch']

  namespaces = namespaces

  constructor(options: CenterGraphOptions) {
    this.options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })

    this.shaclRendererSettings = this.options.shaclRendererSettings ?? defaultSettings('view')
    registerCoreWidgets(this.shaclRendererSettings)
    this.#fetch = (input, init) => this.#d2LFetch.fetch(input, init)
    this.shaclRendererSettings.fetch = this.#fetch
  }

  populateStore() {
    return !navigator.onLine ? populateStore(this.#store) : Promise.resolve()
  }

  get<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.options.base + path
    return new GetApiRequest<T>(this.#fetch, this.options.base, url)
  }

  async create(path: string | NamedNode, dataset: DatasetCore) {
    if (typeof path !== 'string') path = path.value
    const iri = this.options.base + path
    const turtle = await writeTurtle([...dataset])
    const result = await this.#fetch(iri, {
      method: 'PUT',
      body: turtle,
    }).then((response) => response.text())
    console.log(result)
  }

  getFolder(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    if (!path.endsWith('/')) throw new Error('The path must end with a slash')
    const url = path.includes('http://') || path.includes('https://') ? path : this.options.base + path
    return new FolderApiRequest(this.#fetch, url)
  }

  get query() {
    return new ResourceableQueryBuilder<NamedNode[]>({
      base: this.options.base,
      asCount: false,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: this.#fetch,
    })
  }

  get count() {
    return new ResourceableQueryBuilder<number>({
      base: this.options.base,
      asCount: true,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: this.#fetch,
    })
  }

  centergraph = true
}
