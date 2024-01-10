import { Person } from './types'
import { api } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { asResource } from '@centergraph/sdk/lib/asResource'

const {
  namespaces: { rdf, schema },
} = api

const personResource = asResource(api.get<Person>('/contacts/john-doe'))

const contactUrlsResource = asResource(
  api.query.filter(rdf('type'), schema('Person')).filter(schema('givenName')).sort(schema('name'))
)

const countResource = asResource(
  api.count.filter(rdf('type'), schema('Person')).filter(schema('givenName')).sort(schema('name'))
)

export default function App() {
  const person = personResource()
  const count = countResource()
  const contactUrls = contactUrlsResource()

  // const folderRequest = api.getFolder('/contacts/')
  // const contents = useApi(folderRequest)

  return (
    <>
      <img src={api.options.base + '/logo.svg'} style={{ height: 200 }} />
      <h1>
        {person.familyName} {person.givenName}
      </h1>
      <em>{count ?? '...'} results</em>
      <div>
        {contactUrls.map((contactUrl) => (
          <View key={contactUrl.value} data={api.get<Person>(contactUrl)} as="card" />
        ))}
      </div>
    </>
  )
}
