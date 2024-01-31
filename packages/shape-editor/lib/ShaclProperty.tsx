import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Draggable } from 'react-beautiful-dnd'
import { Icon } from '@iconify/react'
import { SortableStateItem, SortableStateItemProperty } from './ShapeEditor'

export default function ShaclProperty(
  props: SortableStateItemProperty & {
    setActiveFormProperty: React.Dispatch<React.SetStateAction<SortableStateItem | null>>
  }
) {
  const { pointer, id, setActiveFormProperty } = props
  const path = pointer.out(sh('path')).value
  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? path.split(/\/|#/g).pop()

  const shOrder = pointer.out(sh('order')).value
  const order = shOrder ? parseFloat(shOrder) : 0

  return (
    <Draggable key={id} draggableId={id} index={order}>
      {(provided) => (
        <div className="shacl-property rounded-1 ps-2 pe-2" ref={provided.innerRef} {...provided.draggableProps}>
          <span className="title d-flex align-items-center">
            <div className="d-flex align-items-center" {...provided.dragHandleProps}>
              <Icon icon="mdi:drag-vertical" style={{ fontSize: '20px' }} />
            </div>
            <span className="p-2">{label}</span>
            <div
              className="d-inline ms-auto p-2 configure-button"
              onClick={(event) => {
                event.preventDefault()
                setActiveFormProperty(props)
              }}
            >
              <Icon icon="mdi:dots-vertical"></Icon>
            </div>
          </span>
        </div>
      )}
    </Draggable>
  )
}
