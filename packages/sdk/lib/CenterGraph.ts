import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import * as namespaces from '@centergraph/shared/lib/namespaces'
import { populateStore } from './populateStore'
import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import type { ShaclRendererProps } from '@centergraph/shacl-renderer'
import { GetApiRequest } from './GetApiRequest'
import { FolderApiRequest } from './FolderApiRequest'
import { ResourceableQueryBuilder } from './ResourceableQueryBuilder'
import { D2LFetchSimpleCache } from 'd2l-fetch-simple-cache/src/d2lfetch-simple-cache.js'

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

  namespaces = namespaces

  constructor(options: CenterGraphOptions) {
    this.options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })

    this.shaclRendererSettings = this.options.shaclRendererSettings ?? defaultSettings('view')
    registerCoreWidgets(this.shaclRendererSettings)
    this.shaclRendererSettings.fetch = (input, init) => this.#d2LFetch.fetch(input, init)
  }

  populateStore() {
    return navigator.onLine ? populateStore(this.#store) : Promise.resolve()
  }

  get<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.options.base + path
    return new GetApiRequest<T>((input, init) => this.#d2LFetch.fetch(input, init), this.options.base, url)
  }

  getFolder(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    if (!path.endsWith('/')) throw new Error('The path must end with a slash')
    const url = path.includes('http://') || path.includes('https://') ? path : this.options.base + path
    return new FolderApiRequest((input, init) => this.#d2LFetch.fetch(input, init), url)
  }

  get query() {
    return new ResourceableQueryBuilder<NamedNode[]>({
      base: this.options.base,
      asCount: false,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: (input, init) => this.#d2LFetch.fetch(input, init),
    })
  }

  get count() {
    return new ResourceableQueryBuilder<number>({
      base: this.options.base,
      asCount: true,
      mode: navigator.onLine ? 'remote' : 'local',
      store: this.#store,
      fetch: (input, init) => this.#d2LFetch.fetch(input, init),
    })
  }

  centergraph = true
}
