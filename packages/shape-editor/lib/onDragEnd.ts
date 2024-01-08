import { DropResult } from 'react-beautiful-dnd'
import { updateOrders } from './helpers/updateOrders'
import { SortableState } from './ShapeEditor'

export const onDragEnd = (
  data: SortableState,
  setData: React.Dispatch<React.SetStateAction<SortableState>>,
  { source, destination }: DropResult
) => {
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
