import { rdf, schema } from '@centergraph/shared/namespaces'
import { api } from './centerGraph'
import { Person } from './types'

export default function App() {
  // const johnDoe = await api.load<Person>('/contacts/john-doe').asObject()
  const contactUrls = api.useDocumentUrls((query) => query.filter(rdf('type'), schema('Person')))

  return (
    <>
      <h1>Hello</h1>
      {contactUrls.map((contactUrl) => api.load<Person>(contactUrl).displayAs('card'))}
    </>
  )
}
