import { useEffect, useState } from 'react'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import { sh } from '../namespaces'
import '@centergraph/shacl-renderer'

type ViewProps = {
  viewMode: string
  url: string
  promise: Promise<string>
  fetch: (typeof globalThis)['fetch']
}

export default function View({ url, promise, fetch }: ViewProps) {
  const [shaclUrl, setShaclUrl] = useState('')

  useEffect(() => {
    promise.then(async (turtle) => {
      const parser = new Parser()
      const quads = await parser.parse(turtle)
      const dataset = datasetFactory.dataset(quads)
      const shapesGraphs = [...dataset.match(null, sh('shapesGraph'))]
      const shaclUrls = shapesGraphs.map((shapesGraph) => shapesGraph.object.value)
      setShaclUrl(shaclUrls[0])
    })
  })

  return shaclUrl ? (
    <shacl-renderer
      ref={(element: HTMLElement) => {
        element.addEventListener('settings', (event: CustomEvent) => {
          event.detail.settings.fetch = fetch
        })
      }}
      shacl-shapes-url={shaclUrl}
      data-url={url}
      mode="view"
    ></shacl-renderer>
  ) : null
}
