import Form from '@centergraph/sdk/lib/react/components/Form'
import { api } from '../centerGraph'
import { useNavigate, useParams } from 'react-router-dom'
import { Person } from '../types'

export default function EditContact() {
  const { slug } = useParams()
  const iri = `/contacts/${slug}`
  const person = api.get<Person>(iri).asResource()
  const navigate = useNavigate()

  return (
    <>
      <h1>
        Edit&nbsp;
        <em>
          {person.givenName} {person.familyName}
        </em>
      </h1>
      <Form
        key={iri}
        data={api.get(iri)}
        afterUpdate={() => {
          navigate(`/contact/${slug}`)
        }}
      >
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            onClick={() => {
              const confirmed = confirm('Are you sure?')
              console.log(confirmed)
            }}
            className="btn mt-4 btn-danger"
          >
            Delete
          </button>
          <button className="btn mt-4 btn-primary">Save</button>
        </div>
      </Form>
    </>
  )
}
