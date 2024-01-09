import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Draggable } from 'react-beautiful-dnd'

export default function ShaclProperty({ pointer, id }: { pointer: GrapoiPointer; id: string }) {
  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()
  const shOrder = pointer.out(sh('order')).value
  const order = shOrder ? parseFloat(shOrder) : 0

  return (
    <Draggable draggableId={id} index={order}>
      {(provided) => (
        <div className="shacl-property" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <span className="title">{label}</span>
        </div>
      )}
    </Draggable>
  )
}
