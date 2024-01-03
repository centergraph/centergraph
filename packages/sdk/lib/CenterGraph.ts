import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import { Loader } from './Loader'
import { populateStore } from './populateStore'

import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { fetchSimpleCache } from 'd2l-fetch-simple-cache'
import { ReactNode, createElement, useEffect, useState } from 'react'
import { AuthProvider, useAuth } from 'react-oidc-context'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import type { ShaclRendererProps } from '@centergraph/shacl-renderer'

export type CenterGraphOptions = {
  base: string
  viewSettings?: ShaclRendererProps['settings']
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()
  #d2LFetch: typeof D2LFetch
  #viewSettings: ShaclRendererProps['settings']

  constructor(options: CenterGraphOptions) {
    this.#options = options

    this.#d2LFetch = new D2LFetch()
    this.#d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
    this.#d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })

    this.#viewSettings = this.#options.viewSettings ?? defaultSettings('view')
    registerCoreWidgets(this.#viewSettings)
    this.#viewSettings.fetch = (input, init) => this.#d2LFetch.fetch(input, init)
  }

  populateStore() {
    return navigator.onLine ? populateStore(this.#store) : null
  }

  load<T>(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value
    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path
    return new Loader<T>(url, this.#options.base, (input, init) => this.#d2LFetch.fetch(input, init), this.#viewSettings)
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

  /**
   * React ContextProvider, abstracting away auth stuff.
   * TODO finish when https://github.com/denoland/deno/issues/19993#issuecomment-1658078788 is fixed
   */
  get AuthProvider() {
    const base = this.#options.base

    return function ({ children }: { children: ReactNode }) {
      const auth = useAuth()
      let fallbackChildren = null

      if (auth?.activeNavigator === 'signinSilent') fallbackChildren = createElement('span', {}, 'Signing you in...')
      else if (auth?.activeNavigator === 'signoutRedirect') fallbackChildren = createElement('span', {}, 'Signing you out...')
      else if (auth?.isLoading) fallbackChildren = createElement('span', {}, 'Loading...')
      else if (auth?.error) fallbackChildren = createElement('span', {}, auth.error.message)

      return createElement(
        AuthProvider,
        {
          authority: `${base}/oidc/`,
          client_id: 'centergraph',
          redirect_uri: `${location.origin}/redirect`,
          scope: 'openid profile',
        },
        fallbackChildren ?? children
      )
    }
  }

  get useAuth() {
    return useAuth
  }
}
