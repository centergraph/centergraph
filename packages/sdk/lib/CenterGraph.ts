import { createElement } from 'react'
import View from './components/View'
import { QueryBuilder } from './QueryBuilder'
import datasetFactory from '@rdfjs/dataset'
import { Parser, DataFactory } from 'n3'
import { NamedNode } from '@rdfjs/types'

export type CenterGraphOptions = {
  base: string
}

export class CenterGraph {
  #options: CenterGraphOptions
  #store = datasetFactory.dataset()

  constructor(options: CenterGraphOptions) {
    this.#options = options
  }

  async populateStore() {
    const cache = await caches.open('api')
    const cachedFiles = await cache.keys()
    const promises = cachedFiles.map(async (request) => {
      const response = await cache.match(request).then((response) => response?.text())
      if (response) {
        const parser = new Parser({
          baseIRI: request.url,
        })
        const quads = parser.parse(response)
        for (const quad of quads)
          this.#store.add(DataFactory.quad(quad.subject, quad.predicate, quad.object, DataFactory.namedNode(request.url)))
      }
    })

    await Promise.all(promises)
  }

  /**
   * Returns a thenable
   * @param path
   * @returns
   */
  get(path: string | NamedNode) {
    if (typeof path !== 'string') path = path.value

    const url = path.includes('http://') || path.includes('https://') ? path : this.#options.base + path

    return {
      url,
      then<TResult = string, TRejection = never>(
        onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
        onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
      ): PromiseLike<TResult | TRejection> {
        return fetch(this.url)
          .then((response) => response.text())
          .then(onfulfilled, onrejected)
      },

      as(viewMode: string) {
        const promise = this as unknown as Promise<string>

        return createElement(View, {
          viewMode,
          url,
          promise,
          key: url,
        })
      },
    }
  }

  get query() {
    return new QueryBuilder({
      base: this.#options.base,
      store: this.#store,
    })
  }
}
