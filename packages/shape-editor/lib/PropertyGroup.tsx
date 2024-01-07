import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Droppable } from 'react-beautiful-dnd'
import { ReactNode } from 'react'

export default function PropertyGroup({ pointer, children }: { pointer?: GrapoiPointer; children: ReactNode }) {
  const label = pointer?.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer?.term.id.split(/\/|#/g).pop() ?? 'undefined'

  return (
    <Droppable droppableId="col-1">
      {(provided) => (
        <details {...provided.droppableProps} ref={provided.innerRef} className={`shacl-group`}>
          <summary className="title">Group: {label}</summary>

          {children}
          {provided.placeholder}
        </details>
      )}
    </Droppable>
  )
}
