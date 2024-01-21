import { ReactNode, useContext } from 'react'
import ShaclRenderer from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'
import { GetApiRequest } from '../../requests/GetApiRequest'
import { centerGraphContext } from '../context'
import { asResource } from '@centergraph/sdk/lib/core/asResource'
import { Suspense } from '@preact-signals/safe-react/react'
import { quadsToShapeObject } from '@centergraph/shared/lib/quadsToShapeObject'
import { Parser } from 'n3'
import grapoi from 'grapoi'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'

type FormProps<T> = {
  data?: GetApiRequest<T>
  shaclUrl?: string
  children?: ReactNode
  pathCreator?: (data: T, pointer: GrapoiPointer) => string
  afterSubmit?: ({ path, object }: { path?: string; object: T }) => void
}

export default function Form<T>({ data, children, shaclUrl, afterSubmit, pathCreator }: FormProps<T>) {
  const { api } = useContext(centerGraphContext)

  if (!shaclUrl && data) shaclUrl = asResource(data.shaclUrl(), data.url + ':shacl')

  return shaclUrl ? (
    <Suspense>
      <ShaclRenderer
        dataUrl={data?.url}
        shaclShapesUrl={shaclUrl}
        onSubmit={async (dataset, pointer) => {
          const context = api.context

          const shaclShape = await api.fetch(shaclUrl!).then((response) => response.text())
          const parser = new Parser()

          const shaclQuads = await parser.parse(shaclShape)
          const shaclPointer = grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })

          const object = await quadsToShapeObject(shaclPointer, pointer, context)

          // Update
          if (data) {
            try {
              data.update(dataset).then(() => {
                if (afterSubmit) afterSubmit({ object })
              })
            } catch (error) {
              console.error(error)
            }
          }
          // Create
          else {
            if (!pathCreator) throw new Error('pathCreator is required for creating new items with the form')
            const path = pathCreator(object, pointer).toLocaleLowerCase().replace(/ /g, '-')
            api.create(path, dataset)
            if (afterSubmit) afterSubmit({ object, path })
          }
        }}
        settings={Object.assign({}, api.shaclRendererSettings, { mode: 'edit' })}
      >
        {children ?? <button className="btn mt-4 btn-primary btn-lg float-end">Save</button>}
      </ShaclRenderer>
    </Suspense>
  ) : null
}
