import { ReactNode, createElement } from 'react'
import View from './components/View'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import { sh } from '@centergraph/shared/lib/namespaces'
import '@centergraph/shacl-renderer'
import grapoi from 'grapoi'
import { quadsToShapeObject } from '@centergraph/shared/lib/quadsToShapeObject'
import type { ShaclRendererProps } from '@centergraph/shacl-renderer'

export class Loader<T> {
  url: string
  #base: string
  #fetch: (typeof globalThis)['fetch']
  #viewSettings: ShaclRendererProps['settings']

  constructor(url: string, base: string, fetch: (typeof globalThis)['fetch'], viewSettings: ShaclRendererProps['settings']) {
    this.url = url
    this.#base = base
    this.#fetch = fetch ?? globalThis.fetch
    this.#viewSettings = viewSettings
  }

  then<TResult = string, TRejection = never>(
    onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
    onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
  ): PromiseLike<TResult | TRejection> {
    return this.#fetch(this.url)
      .then((response) => response.text())
      .then(onfulfilled, onrejected)
  }

  async #shaclUrl(promise: Loader<T>) {
    return promise.then(async (turtle: string) => {
      const parser = new Parser()
      const quads = await parser.parse(turtle)
      const dataset = datasetFactory.dataset(quads)
      const shapesGraphs = [...dataset.match(null, sh('shapesGraph'))]
      const shaclUrls = shapesGraphs.map((shapesGraph) => shapesGraph.object.value)
      return shaclUrls[0]
    })
  }

  #getContext() {
    return this.#fetch(`${this.#base}/api/context`).then((response) => response.json())
  }

  async asObject(): Promise<T> {
    const parser = new Parser()

    const dataTurtle = await this.then()

    const shaclUrl = await this.#shaclUrl(this)
    const shaclShape = await this.#fetch(shaclUrl).then((response) => response.text())
    const shaclQuads = await parser.parse(shaclShape)
    const shaclPointer = grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })

    const dataQuads = await parser.parse(dataTurtle)
    const dataPointer = grapoi({ dataset: datasetFactory.dataset(dataQuads), factory })

    const context = await this.#getContext()

    return await quadsToShapeObject(shaclPointer, dataPointer, context)
  }

  displayAs(viewMode: string): ReactNode {
    return createElement(View, {
      viewMode,
      url: this.url,
      shaclUrlPromise: this.#shaclUrl(this),
      key: this.url,
      settings: this.#viewSettings,
    })
  }
}
