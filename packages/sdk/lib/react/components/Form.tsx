import { useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { cachedAsResource } from '@centergraph/sdk/lib/asResource'

type FormProps = {
  data: GetApiRequest<unknown>
}

export default function Form({ data }: FormProps) {
  const { api } = useContext(centerGraphContext)
  const shaclUrl = cachedAsResource(data.shaclUrl(), data.url + ':shacl')

  return (
    <ShaclRenderer
      dataUrl={data.url}
      shaclShapesUrl={shaclUrl}
      onSubmit={(dataset) => {
        try {
          data.update(dataset)
        } catch (error) {
          console.error(error)
        }
      }}
      settings={Object.assign({}, api.shaclRendererSettings, { mode: 'edit' })}
    >
      <button className="btn mt-4 btn-primary btn-lg float-end">Save</button>
    </ShaclRenderer>
  )
}
