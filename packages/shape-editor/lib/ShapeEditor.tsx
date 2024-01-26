import { useEffect, useState } from 'react'
import './style.css'
import { DragDropContext } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'
import { onDragEnd } from './onDragEnd'
import Form from './Form'
import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import { fetchAppApi } from './helpers/fetchAppApi'

export type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

export type SortableStateItemRegion = {
  type: 'region'
  id: string
  items: Array<SortableStateItemGroup>
}

export type SortableStateItemGroup = {
  type: 'group'
  pointer: GrapoiPointer
  id: string
  items: Array<SortableStateItemProperty>
}

export type SortableStateItemProperty = {
  type: 'property'
  pointer: GrapoiPointer
  id: string
}

export type SortableStateItem = SortableStateItemGroup | SortableStateItemProperty

export type SortableState = Array<SortableStateItemRegion>

let isLoading = false

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [grid, setGrid] = useState<GridData>()
  const [data, setData] = useState<SortableState>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_app, setApp] = useState<GrapoiPointer>()
  const [widgetMetas, setWidgetMetas] = useState<Array<WidgetMeta>>()

  const [activeFormProperty, setActiveFormProperty] = useState<SortableStateItem | null>(null)

  const baseIRI = new URL(shaclShapesUrl, location.origin).toString()

  useEffect(() => {
    if (isLoading) return
    isLoading = true
    loadShapeEditorData(shaclShapesUrl).then(({ pointer, initialData, app, ...grid }) => {
      setShaclPointer(pointer)
      setGrid(grid)
      setData(initialData)
      setApp(app)
      const appUrl = app.value
      if (appUrl) {
        fetchAppApi(appUrl).then(setWidgetMetas)
      }
    })
  }, [fetch, shaclShapesUrl, grid?.hasGrid])

  const { gridTemplateAreas, gridTemplateRows, gridTemplateColumns } = grid ?? {}

  const _undefined = data.find((regionData) => regionData.id === '_undefined')!
  const regions = data.filter((regionData) => regionData.id !== '_undefined')

  const mapGroupRegion = (regionData: SortableStateItemRegion) => {
    if (!shaclPointer) return

    return regionData.items.map((group) => {
      return (
        <PropertyGroup setActiveFormProperty={setActiveFormProperty} key={group.id} {...group}>
          {group.items.map((property) => (
            <ShaclProperty setActiveFormProperty={setActiveFormProperty} key={property.id} {...property} />
          ))}
        </PropertyGroup>
      )
    })
  }

  return grid && shaclPointer && regions ? (
    <>
      {activeFormProperty ? (
        <Form widgetMetas={widgetMetas} item={activeFormProperty} close={() => setActiveFormProperty(null)} />
      ) : null}

      <DragDropContext onDragEnd={(event) => onDragEnd(shaclPointer, baseIRI, data, setData, event)}>
        <div>
          {grid.regions ? (
            <>
              <GridRegion {..._undefined}>{mapGroupRegion(_undefined)}</GridRegion>
              <div
                className="grid mt-5"
                style={{
                  gridTemplateAreas,
                  gridTemplateRows,
                  gridTemplateColumns,
                }}
              >
                {regions.map((regionData) => (
                  <GridRegion key={regionData.id} {...regionData}>
                    {mapGroupRegion(regionData)}
                  </GridRegion>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </DragDropContext>
    </>
  ) : null
}
