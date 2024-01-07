import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { CSSProperties } from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default function ShaclProperty(props: { pointer: GrapoiPointer; style?: CSSProperties }) {
  const { pointer } = props

  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  const shOrder = pointer.out(sh('order')).value
  const order = shOrder ? parseFloat(shOrder) : 0

  return (
    <Draggable draggableId={pointer.term.id} index={order}>
      {(provided) => (
        <div className="shacl-property" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <span className="title">{label}</span>
        </div>
      )}
    </Draggable>
  )
}
