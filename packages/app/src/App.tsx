import { rdf, schema } from '@centergraph/shared/namespaces'
import { api } from './centerGraph'
import { Person } from './types'

const johnDoe = await api.load<Person>('/contacts/john-doe').asObject()
console.log(johnDoe)

export default function App() {
  const contactUrls = api.useDocumentUrls((query) => query.filter(rdf('type'), schema('Person')))

  return (
    <>
      <h1>Hello</h1>
      {contactUrls.map((contactUrl) => api.load<Person>(contactUrl).displayAs('card'))}
    </>
  )
}
