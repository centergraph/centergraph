import ShaclProperty from './ShaclProperty'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PropertyGroup from './PropertyGroup'
import { useEffect, useState } from 'react'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import grapoi from 'grapoi'
import { sh, xsd } from '@centergraph/shared/lib/namespaces'
import './style.css'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [renderCount, setRenderCount] = useState<number>(1)

  useEffect(() => {
    fetch(shaclShapesUrl.split('#')[0])
      .then((response) => response.text())
      .then(async (turtle) => {
        const url = new URL(shaclShapesUrl, location.origin)

        const parser = new Parser({
          baseIRI: url.toString(),
        })
        const quads = await parser.parse(turtle)
        const dataset = datasetFactory.dataset(quads)
        setShaclPointer(grapoi({ dataset, factory, term: factory.namedNode(url.toString()) }))
        return null
      })
  }, [fetch, shaclShapesUrl])

  const propertyGroups = shaclPointer?.node([sh('PropertyGroup')]).in() ?? []

  return shaclPointer && renderCount ? (
    <div>
      <DndProvider backend={HTML5Backend}>
        {[...propertyGroups]?.map((propertyGroup) => {
          const shaclProperties = [...propertyGroup.in()].sort((a, b) => {
            const shOrderA = a.out(sh('order')).value
            const orderA = shOrderA ? parseFloat(shOrderA) : 0

            const shOrderB = b.out(sh('order')).value
            const orderB = shOrderB ? parseFloat(shOrderB) : 0

            return orderB - orderA
          })

          if (renderCount === 1) {
            shaclProperties.forEach((pointer, index) => {
              pointer.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(index.toString(), xsd('double'))])
            })
          }

          return (
            <PropertyGroup setRenderCount={setRenderCount} key={propertyGroup.term.value} pointer={propertyGroup}>
              {shaclProperties.map((shaclProperty) => (
                <ShaclProperty setRenderCount={setRenderCount} key={shaclProperty.term.value} pointer={shaclProperty} />
              ))}
            </PropertyGroup>
          )
        })}
      </DndProvider>
    </div>
  ) : null
}
