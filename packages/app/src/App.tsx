import { Person } from './types'
import { api } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'

const { rdf, schema } = api.namespaces

export default function App() {
  const person = api.get<Person>('/contacts/john-doe').asResource()

  const count = api.count
    .filter(rdf('type'), schema('Person'))
    .filter(schema('givenName'))
    .sort(schema('name'))
    .asResource()

  const contactUrls = api.query
    .filter(rdf('type'), schema('Person'))
    .filter(schema('givenName'))
    .sort(schema('name'))
    .asResource()

  const contents = api.getFolder('/contacts/').asResource()

  return (
    <>
      <img src={api.options.base + '/logo.svg'} style={{ height: 200 }} />

      <h1>
        {person.familyName} {person.givenName}
      </h1>

      <em>{count ?? '...'} results</em>

      {contactUrls.map((contactUrl) => (
        <View key={contactUrl.value} data={api.get<Person>(contactUrl)} as="card" />
      ))}

      <ul>
        {contents.map((contactUrl) => (
          <li key={contactUrl.value}>{contactUrl.value}</li>
        ))}
      </ul>
    </>
  )
}
