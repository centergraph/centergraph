import { AbstractApiRequest } from './AbstractApiRequest'

import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import { ldp } from '@centergraph/shared/lib/namespaces'
import '@centergraph/shacl-renderer'
import grapoi from 'grapoi'
import { NamedNode } from '@rdfjs/types'
import { asResource } from './asResource'

export class FolderApiRequest extends AbstractApiRequest<NamedNode[]> {
  url: string

  constructor(fetch: (typeof globalThis)['fetch'], url: string) {
    super(fetch)
    this.url = url
  }

  fetchArguments() {
    return { input: this.url }
  }

  protected async handleFetch(): Promise<NamedNode[]> {
    const turtle = await this.fetch(this.fetchArguments().input).then((response) => response.text())
    const parser = new Parser()
    const dataQuads = await parser.parse(turtle)
    const dataPointer = grapoi({ dataset: datasetFactory.dataset(dataQuads), factory })
    return dataPointer.out(ldp('contains')).terms
  }

  asResource(): NamedNode[] {
    const promise = this.then()
    const resource = asResource(promise, this.url)
    return resource.read()
  }
}
