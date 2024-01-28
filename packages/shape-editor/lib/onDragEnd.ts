import { DropResult } from 'react-beautiful-dnd'
import { SortableState } from './ShapeEditor'
import { sh, sr } from '@centergraph/shared/lib/namespaces'
import { updateOrders } from './helpers/updateOrders'
import { getData } from './helpers/getData'
import factory from '@rdfjs/data-model'

export const onDragEnd = (
  shaclPointer: GrapoiPointer,
  baseIRI: string,
  data: SortableState,
  setData: React.Dispatch<React.SetStateAction<SortableState>>,
  { source, destination }: DropResult
) => {
  if (destination === undefined || destination === null) return null
  if (source.droppableId === destination.droppableId && destination.index === source.index) return null

  const [startRegion, startGroup] = source.droppableId.split(':')
  const [endRegion, endGroup] = destination.droppableId.split(':')

  if (startRegion && startGroup && endRegion && endGroup) {
    /**
     * A move of a SHACL property inside one group
     */
    if (startGroup === endGroup) {
      const regionData = data.find((region) => region.id === startRegion)
      if (!regionData) throw new Error('Could not find the region')
      const groupData = regionData.items.find((group) => group.id === `${regionData.id}:${startGroup}`)
      if (!groupData) throw new Error('Could not find the group')

      const sourceProperty = groupData.items[source.index]
      const newList = groupData.items.filter((item) => item.id !== sourceProperty.id)
      newList.splice(destination.index, 0, sourceProperty)
      updateOrders(newList.map((item) => item.pointer))

      /**
       * A move of a SHACL property inside one group to another group and possible a different region
       */
    } else {
      const startRegionData = data.find((region) => region.id === startRegion)
      if (!startRegionData) throw new Error('Could not find the region')
      const startGroupData = startRegionData.items.find((group) => group.id === `${startRegionData.id}:${startGroup}`)
      if (!startGroupData) throw new Error('Could not find the starting group')

      const endRegionData = data.find((region) => region.id === endRegion)
      if (!endRegionData) throw new Error('Could not find the region')
      const endGroupData = endRegionData.items.find((group) => group.id === `${endRegionData.id}:${endGroup}`)
      if (!endGroupData) throw new Error('Could not find the ending group')

      const sourceProperty = startGroupData.items[source.index]
      sourceProperty.pointer.deleteOut(sh('group')).addOut(sh('group'), endGroupData.pointer.term)
      const newStartList = startGroupData.items.filter((item) => item.id !== sourceProperty.id)
      updateOrders(newStartList.map((item) => item.pointer))

      const newEndList = [...endGroupData.items]
      newEndList.splice(destination.index, 0, sourceProperty)
      updateOrders(newEndList.map((item) => item.pointer))
    }
  } else if (startRegion && endRegion) {
    /**
     * A move of a group inside one region
     */
    if (startRegion === endRegion) {
      const regionData = data.find((region) => region.id === startRegion)
      if (!regionData) throw new Error('Could not find the region')

      const sourceGroup = regionData.items[source.index]

      const newList = regionData.items.filter((item) => item.id !== sourceGroup.id)
      newList.splice(destination.index, 0, sourceGroup)
      updateOrders(newList.map((item) => item.pointer))
    } else {
      /**
       * A move of a group inside one region to another region
       */
      const startRegionData = data.find((region) => region.id === startRegion)
      if (!startRegionData) throw new Error('Could not find the starting region')
      const endRegionData = data.find((region) => region.id === endRegion)
      if (!endRegionData) throw new Error('Could not find the starting region')

      const sourceGroup = startRegionData.items[source.index]
      sourceGroup.pointer.deleteOut(sr('gridArea')).addOut(sr('gridArea'), factory.literal(endRegionData.id))
      const newStartList = startRegionData.items.filter((item) => item.id !== sourceGroup.id)
      updateOrders(newStartList.map((item) => item.pointer))

      const newEndList = [...endRegionData.items]
      newEndList.splice(destination.index, 0, sourceGroup)
      updateOrders(newEndList.map((item) => item.pointer))
    }
  }

  // Reflect the change in React
  setData(getData(shaclPointer, baseIRI))
}
