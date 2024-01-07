import { useEffect, useState } from 'react'
import './style.css'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { GridData, loadShapeEditorData } from './helpers/loadShapeEditorData'
import GridRegion from './GridRegion'
import { sh, sr, xsd } from '@centergraph/shared/lib/namespaces'
import { sortPointersByShOrder } from './helpers/sortPointersByShOrder'
import { getAllShapesFromShape } from './helpers/getAllShapesFromShape'
import factory from '@rdfjs/data-model'
import PropertyGroup from './PropertyGroup'
import ShaclProperty from './ShaclProperty'
import { resetOrders } from './helpers/resetOrders'
import { updateOrders } from './helpers/updateOrders'

type ShapeEditorProps = {
  shaclShapesUrl: string
  fetch?: typeof globalThis.fetch
}

type SortableState = {
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
        return [propertyGroup.term.value, shaclProperties.sort(sortPointersByShOrder)]
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

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (destination === undefined || destination === null) return null
    if (source.droppableId === destination.droppableId && destination.index === source.index) return null

    const [startRegion, startGroup] = source.droppableId.split('|')
    const [endRegion, endGroup] = destination.droppableId.split('|')

    const start = data[startRegion][startGroup]
    const end = data[endRegion][endGroup]

    if (start === end) {
      const list = start
      const startPointer = list[source.index]

      const newList = list.filter((pointer) => pointer.term.value !== startPointer.term.value)
      newList.splice(destination.index, 0, startPointer)

      updateOrders(newList)

      setData((state) => ({
        ...state,
        [startRegion]: {
          ...state[startRegion],
          [startGroup]: newList,
        },
      }))

      return null
    } else {
      const startPointer = start[source.index]

      const newStartList = start.filter((pointer) => pointer.term.value !== startPointer.term.value)
      const newEndList = [...end]
      newEndList.splice(destination.index, 0, startPointer)

      updateOrders(newStartList)
      updateOrders(newEndList)

      if (startRegion === endRegion) {
        setData((state) => ({
          ...state,
          [startRegion]: {
            ...state[startRegion],
            [startGroup]: newStartList,
            [endGroup]: newEndList,
          },
        }))
      } else {
        setData((state) => ({
          ...state,
          [startRegion]: {
            ...state[startRegion],
            [startGroup]: newStartList,
          },
          [endRegion]: {
            ...state[endRegion],
            [endGroup]: newEndList,
          },
        }))
      }
    }
  }

  const { _undefined, ...regions } = data

  const mapGroupRegion =
    (region: string) =>
    ([groupIri, shaclProperties]: [string, GrapoiPointer[]]) => {
      if (!shaclPointer) return
      const propertyGroup = [...(shaclPointer.node([sh('PropertyGroup')]).in() ?? [])].find(
        (propertyGroup) => propertyGroup.term.value === groupIri
      )

      return (
        <PropertyGroup region={region} key={propertyGroup?.term.value} pointer={propertyGroup}>
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
            <GridRegion name={'undefined'}>{Object.entries(_undefined).map(mapGroupRegion('_undefined'))}</GridRegion>
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
