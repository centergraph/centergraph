import { Person } from './types'
import { api } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { useApi } from '@centergraph/sdk/lib/react/hooks/useApi'

export default function App() {
  const {
    namespaces: { rdf, schema },
  } = api

  const person = useApi(api.get<Person>('/contacts/john-doe'))

  const peopleQuery = api.query.filter(rdf('type'), schema('Person')).filter(schema('givenName')).sort(schema('name'))
  const contactUrls = useApi(peopleQuery)

  const countQuery = api.count.filter(rdf('type'), schema('Person')).filter(schema('givenName')).sort(schema('name'))
  const count = useApi(countQuery)

  // const folderRequest = api.getFolder('/contacts/')
  // const contents = useApi(folderRequest)

  // console.log(contents)

  return (
    <>
      <h1>
        Hello {person?.givenName} {person?.familyName}
      </h1>
      <em>{count ?? '...'} results</em>
      <div>
        {contactUrls?.map((contactUrl) => (
          <View key={contactUrl.value} data={api.get<Person>(contactUrl)} as="card" />
        ))}
      </div>
    </>
  )
}
