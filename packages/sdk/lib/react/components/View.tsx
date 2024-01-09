import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { useApi } from '../hooks/useApi'

type ViewProps = {
  data: GetApiRequest<unknown>
  as: string
}

export default function View({ data, as }: ViewProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = useApi(data.shaclUrl(as))
  return shaclUrl ? <ShaclRenderer dataUrl={data.url} shaclShapesUrl={shaclUrl} settings={api.shaclRendererSettings} /> : null
}
