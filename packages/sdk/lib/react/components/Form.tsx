import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { useApi } from '../hooks/useApi'

type ViewProps = {
  data: GetApiRequest<unknown>
}

export default function Form({ data }: ViewProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = useApi(data.shaclUrl())
  return shaclUrl ? (
    <ShaclRenderer
      dataUrl={data.url}
      shaclShapesUrl={shaclUrl}
      settings={Object.assign({}, api.shaclRendererSettings, { mode: 'edit' })}
    />
  ) : null
}
