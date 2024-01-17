import Form from '@centergraph/sdk/lib/react/components/Form'
import { api, base } from '../centerGraph'
import { useNavigate } from 'react-router-dom'

const { schema } = api.namespaces

export default function AddContact() {
  const navigate = useNavigate()

  return (
    <>
      <h1>Add a person</h1>
      <Form
        pathCreator={(pointer) =>
          `/contacts/${pointer.out(schema('givenName')).value}-${pointer.out(schema('familyName')).value}`
        }
        shaclUrl={`${base}/shapes/contact.shacl`}
        afterSubmit={() => {
          navigate('/')
        }}
      >
        <div className="d-flex justify-content-end gap-2">
          <button className="btn mt-4 btn-primary">Save</button>
        </div>
      </Form>
    </>
  )
}
