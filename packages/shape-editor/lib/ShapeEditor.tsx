import { useEffect, useId, useState } from 'react'
import './style.css'
import { DragDropContext } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'
import { onDragEnd } from './onDragEnd'
import EditForm from './EditForm'
import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import { fetchAppApi } from './helpers/fetchAppApi'
import AddFormPropertyForm from './AddFormPropertyForm'
import AddViewPropertyForm from './AddViewPropertyForm'

export type ShapeEditorProps = {
  shaclShapesUrl: string
  mode: 'view' | 'edit'
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

export default function ShapeEditor(props: ShapeEditorProps) {
  const { shaclShapesUrl, mode } = props
  const fetch = props.fetch ?? globalThis.fetch

  const [shaclPointer, setShaclPointer] = useState<GrapoiPointer>()
  const [grid, setGrid] = useState<GridData>()
  const [data, setData] = useState<SortableState>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_app, setApp] = useState<GrapoiPointer>()
  const [widgetMetas, setWidgetMetas] = useState<Array<WidgetMeta>>()
  const [isLoading, setIsLoading] = useState(false)
  const [showEmptyGroups, setShowEmptyGroups] = useState(false)
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false)

  const [activeFormProperty, setActiveFormProperty] = useState<SortableStateItem | null>(null)

  const baseIRI = new URL(shaclShapesUrl, location.origin).toString()

  useEffect(() => {
    if (isLoading) return
    setIsLoading(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, shaclShapesUrl, grid?.hasGrid])

  const { gridTemplateAreas, gridTemplateRows, gridTemplateColumns } = grid ?? {}

  const _undefined = data.find((regionData) => regionData.id === '_undefined')!
  const regions = data.filter((regionData) => regionData.id !== '_undefined')

  const mapGroupRegion = (regionData: SortableStateItemRegion) => {
    if (!shaclPointer) return

    return regionData.items
      .filter((group) => showEmptyGroups || group.items.length > 0)
      .map((group) => {
        return (
          <PropertyGroup setActiveFormProperty={setActiveFormProperty} key={group.id} {...group}>
            {group.items.map((property) => (
              <ShaclProperty setActiveFormProperty={setActiveFormProperty} key={property.id} {...property} />
            ))}
          </PropertyGroup>
        )
      })
  }

  const showEmptyGroupsId = useId()

  return grid && shaclPointer && regions ? (
    <>
      {activeFormProperty ? (
        <EditForm
          mode={mode}
          widgetMetas={widgetMetas}
          item={activeFormProperty}
          close={() => setActiveFormProperty(null)}
        />
      ) : null}

      {showAddPropertyForm && mode === 'edit' ? (
        <AddFormPropertyForm close={() => setShowAddPropertyForm(false)} />
      ) : null}
      {showAddPropertyForm && mode === 'view' ? (
        <AddViewPropertyForm shaclPointer={shaclPointer} close={() => setShowAddPropertyForm(false)} />
      ) : null}

      <div className="controls d-flex gap-3 align-items-center  mb-4">
        <div className="form-check form-switch">
          <input
            onChange={(event) => setShowEmptyGroups(event.target.checked)}
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={showEmptyGroups}
            id={showEmptyGroupsId}
          />
          <label className="form-check-label" htmlFor={showEmptyGroupsId}>
            Show empty groups
          </label>
        </div>

        <button className="btn btn-secondary">Add group</button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowAddPropertyForm(true)
          }}
        >
          Add property
        </button>
      </div>

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
