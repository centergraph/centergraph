import { rdf, schema } from 'packages/sdk/lib/namespaces'
import { centerGraph } from './centerGraph'
import { DataFactory } from 'n3'
import { useEffect, useState } from 'react'
import { NamedNode } from '@rdfjs/types'

export default function App() {
  const [urls, setUrls] = useState<NamedNode[]>([])

  useEffect(() => {
    centerGraph.query
      .filter(rdf('type'), schema('Person'))
      .filter(schema('givenName'), DataFactory.literal('John'))
      .filter(schema('address'))
      .then(setUrls)
  }, [])

  return (
    <>
      <div>
        <h1>Hello</h1>
        {urls.map((url) => centerGraph.get(url).as('card'))}
      </div>
    </>
  )
}
