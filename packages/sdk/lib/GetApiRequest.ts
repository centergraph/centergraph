import { AbstractApiRequest } from './AbstractApiRequest'

import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import { sh } from '@centergraph/shared/lib/namespaces'
import '@centergraph/shacl-renderer'
import grapoi from 'grapoi'
import { quadsToShapeObject } from '@centergraph/shared/lib/quadsToShapeObject'

export class GetApiRequest<T> extends AbstractApiRequest<T> {
  url: string
  #base: string

  constructor(fetch: (typeof globalThis)['fetch'], base: string, url: string) {
    super(fetch)
    this.#base = base
    this.url = url
  }

  fetchArguments() {
    return { input: this.url }
  }

  protected async handleFetch(): Promise<T> {
    const shaclPointer = await this.#shaclPointer()
    const dataPointer = await this.#dataPointer()
    const context = await this.#getContext()
    return await quadsToShapeObject(shaclPointer, dataPointer, context)
  }

  async #dataPointer() {
    const turtle = await this.fetch(this.fetchArguments().input).then((response) => response.text())
    const parser = new Parser()
    const dataQuads = await parser.parse(turtle)
    return grapoi({ dataset: datasetFactory.dataset(dataQuads), factory })
  }

  async #shaclPointer() {
    const shaclUrl = await this.shaclUrl()
    const parser = new Parser()
    const shaclShape = await this.fetch(shaclUrl).then((response) => response.text())
    const shaclQuads = await parser.parse(shaclShape)
    return grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })
  }

  async shaclUrl(viewMode?: string) {
    const turtle = await this.fetch(this.fetchArguments().input).then((response) => response.text())
    const parser = new Parser()
    const quads = await parser.parse(turtle)
    const dataset = datasetFactory.dataset(quads)
    const shapesGraphs = [...dataset.match(null, sh('shapesGraph'))]
    const shaclUrls = shapesGraphs.map((shapesGraph) => shapesGraph.object.value)
    return `${shaclUrls[0]}${viewMode ? '#' + viewMode : ''}`
  }

  async #getContext() {
    return this.fetch(`${this.#base}/api/context`).then((response) => response.json())
  }
}
