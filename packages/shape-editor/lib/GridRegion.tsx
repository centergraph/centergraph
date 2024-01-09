import { ReactNode } from 'react'
import { Droppable } from 'react-beautiful-dnd'

export default function GridRegion({ name, children }: { children?: ReactNode; name: string }) {
  return (
    <Droppable droppableId={name} type="group">
      {(provided, monitor) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ gridArea: name ?? 'undefined' }}
          className={`grid-region grid-region-${name ?? 'undefined'} ${monitor.isDraggingOver ? 'is-dragging-over' : ''}`}
        >
          <span className="name">{name !== '_undefined' ? `Region:  ${name}` : 'No region'}</span>
          {children}
        </div>
      )}
    </Droppable>
  )
}
