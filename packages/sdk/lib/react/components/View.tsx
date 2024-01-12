import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { cachedAsResource } from '@centergraph/sdk/lib/asResource'

type ViewProps = {
  data: GetApiRequest<unknown>
  as: string
}

export default function View({ data, as }: ViewProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = cachedAsResource(data.shaclUrl(as), data.url + ':shacl:' + as)

  return (
    <ShaclRenderer
      dataUrl={data.url}
      shaclShapesUrl={shaclUrl}
      settings={Object.assign({}, api.shaclRendererSettings, { mode: 'view' })}
    />
  )
}
