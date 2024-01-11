import Form from '@centergraph/sdk/lib/react/components/Form'
import { api } from './centerGraph'
import { useParams } from 'react-router-dom'

export default function ViewContact() {
  const { slug } = useParams()
  const path = `/contacts/${slug}`
  return <Form key={path} data={api.get(path)} />
}
