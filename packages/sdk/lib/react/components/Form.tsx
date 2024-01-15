import { ReactNode, useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { asResource } from '@centergraph/sdk/lib/asResource'

type FormProps = {
  data: GetApiRequest<unknown>
  children?: ReactNode
  afterUpdate?: () => void
}

export default function Form({ data, children, afterUpdate }: FormProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = asResource(data.shaclUrl(), data.url + ':shacl')

  return shaclUrl ? (
    <ShaclRenderer
      dataUrl={data.url}
      shaclShapesUrl={shaclUrl}
      onSubmit={(dataset) => {
        try {
          data.update(dataset).then(() => {
            if (afterUpdate) afterUpdate()
          })
        } catch (error) {
          console.error(error)
        }
      }}
      settings={Object.assign({}, api.shaclRendererSettings, { mode: 'edit' })}
    >
      {children ?? <button className="btn mt-4 btn-primary btn-lg float-end">Save</button>}
    </ShaclRenderer>
  ) : null
}
