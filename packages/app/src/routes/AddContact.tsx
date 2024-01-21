import Form from '@centergraph/sdk/lib/react/components/Form'
import { base } from '../centerGraph'
import { useNavigate } from 'react-router-dom'
import { Person } from '../types'

export default function AddContact() {
  const navigate = useNavigate()

  return (
    <>
      <h1>Add a person</h1>
      <Form<Person>
        pathCreator={(object) => `/contacts/${object.givenName}-${object.familyName}`}
        shaclUrl={`${base}/shapes/contact.shacl`}
        afterSubmit={() => navigate('/')}
      >
        <div className="d-flex justify-content-end gap-2">
          <button className="btn mt-4 btn-primary">Save</button>
        </div>
      </Form>
    </>
  )
}
