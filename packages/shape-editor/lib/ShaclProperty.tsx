import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { useDrag } from 'react-dnd'

type ShaclPropertyProps = {
  pointer: GrapoiPointer
  isDragging?: boolean
}

export default function ShaclProperty({ pointer }: ShaclPropertyProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ShaclProperty',
    item: pointer.term,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  return (
    <div className={`shacl-property ${isDragging ? 'is-dragging' : ''}`} ref={drag}>
      <span className="title">{label}</span>
    </div>
  )
}
