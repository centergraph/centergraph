import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { asResource } from '@centergraph/sdk/lib/asResource'
import '@centergraph/shacl-renderer/lib/style.css'

type ViewProps = {
  data: GetApiRequest<unknown>
  as: string
}

export default function View({ data, as }: ViewProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = asResource(data.shaclUrl(as), data.url + ':shacl:' + as)

  return shaclUrl ? (
    <ShaclRenderer
      dataUrl={data.url}
      shaclShapesUrl={shaclUrl}
      settings={Object.assign({}, api.shaclRendererSettings, { mode: 'view' })}
    />
  ) : null
}
