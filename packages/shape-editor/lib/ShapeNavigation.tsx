import { useEffect, useState } from 'react'
import { Parser } from 'n3'
import grapoi from 'grapoi'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { sr, rdf, schema } from '@centergraph/shared/lib/namespaces'
import ShapeEditor from './ShapeEditor'
import { Icon } from '@iconify/react'

type ShapeNavigationProps = {
  shaclShapesUrl: string
}

type ShapeMeta = {
  label: string
  iri: string
  type: 'view' | 'edit'
}

type ShapesMeta = ShapeMeta[]

const getShapeFileMeta = async (url: string): Promise<ShapesMeta> => {
  const response = await fetch(url).then((response) => response.text())
  const parser = new Parser()
  const quads = parser.parse(response)
  const dataset = datasetFactory.dataset(quads)
  const pointer = grapoi({ dataset, factory })

  const forms = pointer.hasOut(rdf('type'), sr('MainShape'))
  const views = pointer.hasOut(rdf('type'), sr('ViewShape'))

  const output: ShapesMeta = []

  for (const form of forms) {
    output.push({
      label: form.out(schema('name')).value,
      iri: url + form.term.value,
      type: 'edit',
    })
  }

  for (const view of views) {
    output.push({
      label: view.out(schema('name')).value,
      iri: url + view.term.value,
      type: 'view',
    })
  }

  return output
}

export default function ShapeNavigation({ shaclShapesUrl }: ShapeNavigationProps) {
  const [meta, setMeta] = useState<ShapesMeta>()
  const [currentShapeIri, setCurrentShapeIri] = useState('')

  useEffect(() => {
    getShapeFileMeta(shaclShapesUrl).then((meta) => {
      setMeta(meta)
      if (!currentShapeIri && meta[0]) setCurrentShapeIri(meta[0].iri)
    })
  }, [shaclShapesUrl, currentShapeIri])

  const selectedShape = meta?.find((item) => item.iri === currentShapeIri)

  return (
    <>
      <header className="d-flex gap-2 mb-5 align-items-center">
        {selectedShape ? (
          <h1 className="h3 d-flex text-nowrap">
            <Icon icon={selectedShape.type === 'edit' ? 'mdi:form' : 'mdi:eye'} />
            &nbsp; Edit {selectedShape.type}:
          </h1>
        ) : null}

        <div className="ms-2">
          <select
            value={currentShapeIri}
            onChange={(event) => setCurrentShapeIri(event.target.value)}
            className="form-select"
          >
            <optgroup label="Forms">
              {meta
                ?.filter((item) => item.type === 'edit')
                .map(({ label, iri }) => (
                  <option key={iri} value={iri}>
                    {label}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Views">
              {meta
                ?.filter((item) => item.type === 'view')
                .map(({ label, iri }) => (
                  <option key={iri} value={iri}>
                    {label}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {selectedShape ? <button className="btn btn-primary">Save</button> : null}
      </header>

      {currentShapeIri ? (
        <ShapeEditor mode={selectedShape!.type} key={currentShapeIri} shaclShapesUrl={currentShapeIri} />
      ) : null}
    </>
  )
}
