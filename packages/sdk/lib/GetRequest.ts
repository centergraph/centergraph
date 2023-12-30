import { createElement } from 'react'
import View from './components/View'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import { sh } from '@centergraph/shared/namespaces'
import '@centergraph/shacl-renderer'

export class GetRequest {
  #url: string
  #fetch: (typeof globalThis)['fetch']

  constructor(url: string, fetch?: (typeof globalThis)['fetch']) {
    this.#url = url
    this.#fetch = fetch ?? globalThis.fetch
  }

  then<TResult = string, TRejection = never>(
    onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
    onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
  ): PromiseLike<TResult | TRejection> {
    return this.#fetch(this.#url)
      .then((response) => response.text())
      .then(onfulfilled, onrejected)
  }

  async #shaclUrl() {
    return this.then(async (turtle: string) => {
      const parser = new Parser()
      const quads = await parser.parse(turtle)
      const dataset = datasetFactory.dataset(quads)
      const shapesGraphs = [...dataset.match(null, sh('shapesGraph'))]
      const shaclUrls = shapesGraphs.map((shapesGraph) => shapesGraph.object.value)
      return shaclUrls[0]
    })
  }

  asJSON () {
    
  }

  viewAs(viewMode: string) {
    return createElement(View, {
      viewMode,
      url: this.#url,
      shaclUrlPromise: this.#shaclUrl(),
      key: this.#url,
      fetch: this.#fetch,
    })
  }
}
