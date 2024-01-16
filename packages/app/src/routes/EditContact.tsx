import Form from '@centergraph/sdk/lib/react/components/Form'
import { api } from '../centerGraph'
import { useNavigate, useParams } from 'react-router-dom'
import { Person } from '../types'
import View from '@centergraph/sdk/lib/react/components/View'

export default function EditContact() {
  const { slug } = useParams()
  const iri = `/contacts/${slug}`
  const person = api.get<Person>(iri).asResource()
  const navigate = useNavigate()

  if (!person) return null

  return (
    <>
      <h1>
        Edit&nbsp;
        <em>
          <View data={api.get<Person>(iri)} as="card" />
        </em>
      </h1>
      <Form
        key={iri}
        data={api.get(iri)}
        afterSubmit={() => {
          navigate(`/contact/${slug}`)
        }}
      >
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            onClick={async () => {
              const confirmed = confirm('Are you sure?')
              if (confirmed) {
                await api.get(iri).delete()
                navigate(`/`)
              }
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
