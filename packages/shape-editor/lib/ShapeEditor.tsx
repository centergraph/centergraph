import { useEffect, useState } from 'react'
import './style.css'
import { DragDropContext } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import { sh } from '@centergraph/shared/lib/namespaces'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'
import { onDragEnd } from './onDragEnd'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

export type SortableState = {
  [region: string]: {
    [group: string]: GrapoiPointer[]
  }
}

let isLoading = false

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [renderCount, setRenderCount] = useState<number>(1)
  const [grid, setGrid] = useState<GridData>()
  const [data, setData] = useState<SortableState>({})

  useEffect(() => {
    if (isLoading) return
    isLoading = true
    loadShapeEditorData(shaclShapesUrl).then(({ pointer, initialData, ...grid }) => {
      setShaclPointer(pointer)
      setGrid(grid)
      setData(initialData)
    })
  }, [fetch, shaclShapesUrl, grid?.hasGrid])

  const { gridTemplateAreas, gridTemplateRows, gridTemplateColumns } = grid ?? {}

  const { _undefined, ...regions } = data

  const mapGroupRegion =
    (region: string) =>
    ([groupIri, shaclProperties]: [string, GrapoiPointer[]]) => {
      if (!shaclPointer) return
      const propertyGroup = [...(shaclPointer.node([sh('PropertyGroup')]).in() ?? [])].find(
        (propertyGroup) => propertyGroup.term.value === groupIri
      )!

      return (
        <PropertyGroup region={region} key={propertyGroup.term.value} pointer={propertyGroup}>
          {shaclProperties.map((shaclProperty) => (
            <ShaclProperty key={shaclProperty.term.value} pointer={shaclProperty} />
          ))}
        </PropertyGroup>
      )
    }

  return grid && shaclPointer && renderCount ? (
    <DragDropContext onDragEnd={(event) => onDragEnd(data, setData, event)}>
      <div>
        {grid.regions ? (
          <>
            <GridRegion name={'_undefined'}>{Object.entries(_undefined).map(mapGroupRegion('_undefined'))}</GridRegion>
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
                  {Object.entries(groups).map(mapGroupRegion(region))}
                </GridRegion>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </DragDropContext>
  ) : null
}
