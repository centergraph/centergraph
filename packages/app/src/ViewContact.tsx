import View from '@centergraph/sdk/lib/react/components/View'
import { api } from './centerGraph'
import { useParams } from 'react-router-dom'

export default function ViewContact() {
  const { slug } = useParams()
  const path = `/contacts/${slug}`
  return <View key={path} data={api.get(path)} as="full" />
}
