import { useEffect, useState } from 'react'
import './style.css'
import { DragDropContext } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import { sh, sr } from '@centergraph/shared/lib/namespaces'
import { sortPointersByShOrder } from './helpers/sortPointersByShOrder'
import { getAllShapesFromShape } from './helpers/getAllShapesFromShape'
import factory from '@rdfjs/data-model'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

type SortableState = {
  [region: string]: {
    [group: string]: GrapoiPointer[]
  }
}

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [renderCount, setRenderCount] = useState<number>(1)
  const [grid, setGrid] = useState<GridData>()
  const [data, setData] = useState<SortableState>({})

  useEffect(() => {
    loadShapeEditorData(shaclShapesUrl).then(({ pointer, ...grid }) => {
      setShaclPointer(pointer)
      setGrid(grid)

      const url = new URL(shaclShapesUrl, location.origin)
      const shapeIris = getAllShapesFromShape(pointer, factory.namedNode(url.toString()))
      const shapes = pointer?.node(shapeIris)

      const mapPropertyGroup = (propertyGroup: GrapoiPointer) => {
        const shaclProperties = [...(shapes?.out(sh('property')) ?? [])].filter(
          (property) => property.out(sh('group')).value === propertyGroup.term.value
        )
        return [propertyGroup.term.value, shaclProperties]
      }

      const getPropertyGroups = (filterGridArea: string) => {
        const allPropertyGroups = [...(pointer?.node([sh('PropertyGroup')]).in() ?? [])]
        return allPropertyGroups
          .filter((propertyGroup) => {
            const gridArea = propertyGroup.out(sr('gridArea')).value
            if (filterGridArea === '_undefined' && !grid?.hasGrid) return true
            if (filterGridArea === '_undefined' && grid?.hasGrid) return gridArea === undefined
            return gridArea === filterGridArea
          })
          .sort(sortPointersByShOrder)
          .map(mapPropertyGroup)
      }

      const initialData = Object.fromEntries(
        ['_undefined', ...grid.regions].map((region) => {
          return [region, Object.fromEntries(getPropertyGroups(region))]
        })
      )

      setData(initialData)
    })
  }, [fetch, shaclShapesUrl, grid?.hasGrid])

  const { gridTemplateAreas, gridTemplateRows, gridTemplateColumns } = grid ?? {}

  const onDragEnd = () => null

  const { _undefined, ...regions } = data

  const mapGroupRegion = ([groupIri, shaclProperties]: [string, GrapoiPointer[]]) => {
    if (!shaclPointer) return
    const propertyGroup = [...(shaclPointer.node([sh('PropertyGroup')]).in() ?? [])].find(
      (propertyGroup) => propertyGroup.term.value === groupIri
    )

    return (
      <PropertyGroup key={propertyGroup?.term.value} pointer={propertyGroup}>
        {shaclProperties.map((shaclProperty) => (
          <ShaclProperty key={shaclProperty.term.value} pointer={shaclProperty} />
        ))}
      </PropertyGroup>
    )
  }

  return grid && shaclPointer && renderCount ? (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        {grid.regions ? (
          <>
            <GridRegion name={'undefined'}>{Object.entries(_undefined).map(mapGroupRegion)}</GridRegion>
            <div
              className="grid mt-5"
              style={{
                gridTemplateAreas,
                gridTemplateRows,
                gridTemplateColumns,
              }}
            >
              {Object.entries(regions).map(([region, groups]) => (
                <GridRegion key={region} name={region}>
                  {Object.entries(groups).map(mapGroupRegion)}
                </GridRegion>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </DragDropContext>
  ) : null
}
