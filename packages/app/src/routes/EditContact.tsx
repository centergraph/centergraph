import Form from '@centergraph/sdk/lib/react/components/Form'
import { api } from '../centerGraph'
import { useParams } from 'react-router-dom'
import { Person } from '../types'

export default function EditContact() {
  const { slug } = useParams()
  const path = `/contacts/${slug}`
  const person = api.get<Person>(path).asResource()

  return (
    <>
      <h1>
        Edit{' '}
        <em>
          {person.givenName} {person.familyName}
        </em>
      </h1>
      <Form key={path} data={api.get(path)} />
    </>
  )
}
