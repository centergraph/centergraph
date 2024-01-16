import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { asResource } from '@centergraph/sdk/lib/asResource'
import '@centergraph/shacl-renderer/lib/style.css'
import { Suspense } from '@preact-signals/safe-react/react'

type ViewProps = {
  data: GetApiRequest<unknown>
  as: string
}

export default function View({ data, as }: ViewProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = asResource(data.shaclUrl(as), data.url + ':shacl:' + as)

  return shaclUrl ? (
    <Suspense>
      <ShaclRenderer
        dataUrl={data.url}
        shaclShapesUrl={shaclUrl}
        settings={Object.assign({}, api.shaclRendererSettings, { mode: 'view' })}
      />
    </Suspense>
  ) : null
}
