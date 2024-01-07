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
import PropertyGroup from './PropertyGroup'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

const resetOrders = (propertyGroups: GrapoiPointer) => {
  for (const propertyGroup of [...propertyGroups]) {
    const shaclProperties = [...propertyGroup.in()].sort(sortPointersByShOrder)

    shaclProperties.forEach((pointer, index) => {
      pointer.deleteOut(sh('order')).addOut(sh('order'), [factory.literal((index + 1).toString(), xsd('double'))])
    })
  }
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

        resetOrders(propertyGroups)

        setShaclPointer(pointer)
      })
  }, [fetch, shaclShapesUrl])

  const allPropertyGroups = [...(shaclPointer?.node([sh('PropertyGroup')]).in() ?? [])]

  const grid = shaclPointer?.out(sr('grid'))
  const regions = [...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? [])]

  const gridTemplateAreas = grid?.out(sr('grid-template-areas')).value
  const gridTemplateRows = grid?.out(sr('grid-template-rows')).value
  const gridTemplateColumns = grid?.out(sr('grid-template-columns')).value

  const url = new URL(shaclShapesUrl, location.origin)
  const shapeIris = shaclPointer ? getAllShapesFromShape(shaclPointer, factory.namedNode(url.toString())) : []
  const shapes = shaclPointer?.node(shapeIris)

  const getPropertyGroups = (filterGridArea: string | undefined) =>
    allPropertyGroups
      .filter((propertyGroup) => {
        const gridArea = propertyGroup.out(sr('gridArea')).value
        return gridArea === filterGridArea
      })
      .sort(sortPointersByShOrder)

  return shaclPointer && renderCount && shapes ? (
    <div>
      <GridRegion name={'unassigned'}>
        {(grid?.value ? getPropertyGroups(undefined) : allPropertyGroups).map((propertyGroup) => (
          <PropertyGroup key={propertyGroup?.term.value ?? 'undefined'} shapes={shapes} pointer={propertyGroup ?? shapes} />
        ))}
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
              <GridRegion key={region} name={region}>
                {getPropertyGroups(region).map((propertyGroup) => (
                  <PropertyGroup key={propertyGroup?.term.value ?? 'undefined'} shapes={shapes} pointer={propertyGroup ?? shapes} />
                ))}
              </GridRegion>
            ))}
          </div>
        </>
      ) : null}
    </div>
  ) : null
}
