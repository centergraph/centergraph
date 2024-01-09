import { useEffect, useState } from 'react'
import './style.css'
import { DragDropContext } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'
import { onDragEnd } from './onDragEnd'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

type SortableStateItemRegion = {
  type: 'region'
  id: string
  children: Array<SortableStateItemGroup>
}

type SortableStateItemGroup = {
  type: 'group'
  pointer: GrapoiPointer
  id: string
  children: Array<SortableStateItemProperty>
}

type SortableStateItemProperty = {
  type: 'property'
  pointer: GrapoiPointer
  id: string
}

export type SortableState = Array<SortableStateItemRegion>

let isLoading = false

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [renderCount, setRenderCount] = useState<number>(1)
  const [grid, setGrid] = useState<GridData>()
  const [data, setData] = useState<SortableState>([])

  const baseIRI = new URL(shaclShapesUrl, location.origin).toString()

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

  const _undefined = data.find((regionData) => regionData.id === '_undefined')!
  const regions = data.filter((regionData) => regionData.id !== '_undefined')

  const mapGroupRegion = (regionData: SortableStateItemRegion) => {
    if (!shaclPointer) return

    return regionData.children.map((group) => {
      return (
        <PropertyGroup key={group.id} id={group.id} pointer={group.pointer}>
          {group.children.map((property) => (
            <ShaclProperty key={property.id} id={property.id} pointer={property.pointer} />
          ))}
        </PropertyGroup>
      )
    })
  }

  return grid && shaclPointer && renderCount && regions ? (
    <DragDropContext onDragEnd={(event) => onDragEnd(shaclPointer, baseIRI, data, setData, event)}>
      <div>
        {grid.regions ? (
          <>
            <GridRegion name={'_undefined'}>{mapGroupRegion(_undefined)}</GridRegion>
            <div
              className="grid mt-5"
              style={{
                gridTemplateAreas,
                gridTemplateRows,
                gridTemplateColumns,
              }}
            >
              {regions.map((regionData) => (
                <GridRegion key={regionData.id} name={regionData.id}>
                  {mapGroupRegion(regionData)}
                </GridRegion>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </DragDropContext>
  ) : null
}
