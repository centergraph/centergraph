import { rdf, schema } from '@centergraph/shared/namespaces'
import { api } from './centerGraph'

export default function App() {
  const urls = api.useDocumentUrls((query) => query.filter(rdf('type'), schema('Person')))

  return (
    <>
      <div>
        <h1>Hello</h1>
        {urls.map((url) => api.get(url).viewAs('card'))}
      </div>
    </>
  )
}
