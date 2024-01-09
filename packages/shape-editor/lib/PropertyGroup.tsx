import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { ReactNode } from 'react'

export default function PropertyGroup({ id, pointer, children }: { pointer: GrapoiPointer; children: ReactNode; id: string }) {
  const label = pointer?.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer?.term.id.split(/\/|#/g).pop() ?? 'undefined'
  const shOrder = pointer.out(sh('order')).value
  const order = shOrder ? parseFloat(shOrder) : 0

  return (
    <Draggable draggableId={pointer.term.id} index={order}>
      {(dragProvided) => (
        <Droppable droppableId={id} type="property">
          {(dropProvided) => (
            <details
              ref={dragProvided.innerRef}
              {...dragProvided.draggableProps}
              {...dragProvided.dragHandleProps}
              className={`shacl-group`}
            >
              <summary className="title">Group: {label}</summary>

              <div className="inner" {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
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
