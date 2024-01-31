import { ReactNode } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { SortableStateItemRegion } from './ShapeEditor'

export default function GridRegion({ id, children }: SortableStateItemRegion & { children: ReactNode }) {
  return (
    <Droppable droppableId={id} type="group">
      {(provided, monitor) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ gridArea: id ?? 'undefined' }}
          className={`grid-region p-3 grid-region-${id ?? 'undefined'} ${
            monitor.isDraggingOver ? 'is-dragging-over' : ''
          }`}
        >
          <em className="name text-muted d-block pb-2">{id !== '_undefined' ? `Region:  ${id}` : 'No region'}</em>
          <div className="d-flex flex-column gap-2">{children}</div>
        </div>
      )}
    </Droppable>
  )
}
