import { ReactNode, useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../GetApiRequest'
import { centerGraphContext } from '../context'
import { asResource } from '@centergraph/sdk/lib/asResource'
import { Suspense } from '@preact-signals/safe-react/react'

type FormProps = {
  data?: GetApiRequest<unknown>
  shaclUrl?: string
  children?: ReactNode
  pathCreator?: (pointer: GrapoiPointer) => string
  afterSubmit?: () => void
}

export default function Form({ data, children, shaclUrl, afterSubmit, pathCreator }: FormProps) {
  const { api } = useContext(centerGraphContext)

  if (!shaclUrl && data) shaclUrl = asResource(data.shaclUrl(), data.url + ':shacl')

  return shaclUrl ? (
    <Suspense>
      <ShaclRenderer
        dataUrl={data?.url}
        shaclShapesUrl={shaclUrl}
        onSubmit={(dataset, pointer) => {
          // Update
          if (data) {
            try {
              data.update(dataset).then(() => {
                if (afterSubmit) afterSubmit()
              })
            } catch (error) {
              console.error(error)
            }
          }
          // Create
          else {
            if (!pathCreator) throw new Error('pathCreator is required for creating new items with the form')
            const path = pathCreator(pointer).toLocaleLowerCase()
            api.create(path, dataset)
          }
        }}
        settings={Object.assign({}, api.shaclRendererSettings, { mode: 'edit' })}
      >
        {children ?? <button className="btn mt-4 btn-primary btn-lg float-end">Save</button>}
      </ShaclRenderer>
    </Suspense>
  ) : null
}
