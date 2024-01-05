import ShaclProperty from './ShaclProperty'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PropertyGroup from './PropertyGroup'
import { useEffect, useState } from 'react'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import grapoi from 'grapoi'
import { sh, xsd, sr } from '@centergraph/shared/lib/namespaces'
import './style.css'
import { sortPointersByShOrder } from './helpers/sortPointersByShOrder'
import { getAllShapesFromShape } from './helpers/getAllShapesFromShape'
import GridRegion from './GridRegion'

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
        const pointer = grapoi({ dataset, factory, term: factory.namedNode(url.toString()) })
        const propertyGroups = pointer?.node([sh('PropertyGroup')]).in() ?? []

        for (const propertyGroup of [...propertyGroups]) {
          const shaclProperties = [...propertyGroup.in()].sort(sortPointersByShOrder)

          shaclProperties.forEach((pointer, index) => {
            pointer.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(index.toString(), xsd('double'))])
          })
        }

        setShaclPointer(pointer)
      })
  }, [fetch, shaclShapesUrl])

  const propertyGroups = [...(shaclPointer?.node([sh('PropertyGroup')]).in() ?? [])].sort(sortPointersByShOrder)

  const grid = shaclPointer?.out(sr('grid'))
  const regions = [...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? [])]

  const gridTemplateAreas = grid?.out(sr('grid-template-areas')).value
  const gridTemplateRows = grid?.out(sr('grid-template-rows')).value
  const gridTemplateColumns = grid?.out(sr('grid-template-columns')).value

  const getPropertyGroups = (filterGridArea: string | undefined) =>
    propertyGroups.filter((propertyGroup) => {
      const gridArea = propertyGroup.out(sr('gridArea')).value
      return gridArea === filterGridArea
    })

  const renderPropertyGroup = (propertyGroup: GrapoiPointer) => {
    if (!shaclPointer) return null

    const url = new URL(shaclShapesUrl, location.origin)
    const shapeIris = getAllShapesFromShape(shaclPointer, factory.namedNode(url.toString()))
    const shapes = shaclPointer.node(shapeIris)

    const shaclProperties = [...shapes.out(sh('property'))].filter((property) => {
      return property.out(sh('group')).value === propertyGroup?.term.value
    })

    return (
      <PropertyGroup setRenderCount={setRenderCount} key={propertyGroup?.term.value ?? 'undefined'} pointer={propertyGroup ?? shaclPointer}>
        {shaclProperties.map((shaclProperty) => (
          <ShaclProperty setRenderCount={setRenderCount} key={shaclProperty.term.value} pointer={shaclProperty} />
        ))}
      </PropertyGroup>
    )
  }

  return shaclPointer && renderCount ? (
    <div>
      <GridRegion name={'unassigned'} setRenderCount={setRenderCount}>
        {(grid?.value ? getPropertyGroups(undefined) : propertyGroups).map(renderPropertyGroup)}
      </GridRegion>

      {regions.length ? (
        <>
          <div
            className="grid mt-5"
            style={{
              gridTemplateAreas,
              gridTemplateRows,
              gridTemplateColumns,
            }}
          >
            {regions.map((region) => (
              <GridRegion key={region} name={region} setRenderCount={setRenderCount}>
                {getPropertyGroups(region).map(renderPropertyGroup)}
              </GridRegion>
            ))}
          </div>
        </>
      ) : null}
    </div>
  ) : null
}
