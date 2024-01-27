import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { SortableStateItem, SortableStateItemGroup } from './ShapeEditor'

export default function PropertyGroup(
  props: SortableStateItemGroup & {
    children: ReactNode
    setActiveFormProperty: React.Dispatch<React.SetStateAction<SortableStateItem | null>>
  }
) {
  const { id, pointer, children, setActiveFormProperty } = props
  const label =
    pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ??
    pointer.term?.id.split(/\/|#/g).pop() ??
    'undefined'
  const shOrder = pointer.out(sh('order')).value
  const order = shOrder ? parseFloat(shOrder) : 0

  return (
    <Draggable draggableId={pointer.term?.id ?? id} index={order}>
      {(dragProvided, dragMonitor) => (
        <Droppable droppableId={id} type="property">
          {(dropProvided, monitor) => (
            <details
              ref={dragProvided.innerRef}
              {...dragProvided.draggableProps}
              className={`shacl-group ${id} p-2 rounded-2 ${dragMonitor.isDragging ? 'is-dragged' : ''} ${
                monitor.isDraggingOver ? 'is-dragging-over' : ''
              }`}
            >
              <summary className="title d-flex align-items-center">
                <div className="d-flex handle align-items-center" {...dragProvided.dragHandleProps}>
                  <Icon icon="mdi:drag-vertical" style={{ fontSize: '20px' }} />
                </div>
                <Icon className="chevron" style={{ fontSize: '30px' }} icon="mdi:chevron-right"></Icon>
                <span className="p-2">{pointer.term ? `Group: ${label}` : `Properties without a group`}</span>
                {pointer.term ? (
                  <div
                    className="d-inline ms-auto p-2 configure-button"
                    onClick={(event) => {
                      event.preventDefault()
                      setActiveFormProperty(props)
                    }}
                  >
                    <Icon icon="mdi:dots-vertical"></Icon>
                  </div>
                ) : null}
              </summary>

              <div
                className="inner gap-2 pt-2 d-flex flex-column"
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
              >
                {children}
                {dropProvided.placeholder}
              </div>
            </details>
          )}
        </Droppable>
      )}
    </Draggable>
  )
}
