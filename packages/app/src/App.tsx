import { Person } from './types'
import { api } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { useApi } from '@centergraph/sdk/lib/react/hooks/useApi'

export default function App() {
  const { namespaces } = api
  const person = useApi(api.get<Person>('/contacts/john-doe'))
  const contactUrls = useApi(api.query.filter(namespaces.rdf('type'), namespaces.schema('Person')))

  return (
    <>
      <h1>
        Hello {person?.givenName} {person?.familyName}
      </h1>
      <div>
        {contactUrls?.map((contactUrl) => (
          <View key={contactUrl.value} data={api.get<Person>(contactUrl)} as="card" />
        ))}
      </div>
    </>
  )
}
