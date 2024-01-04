import { rdfs, schema, sh, xsd } from '@centergraph/shared/lib/namespaces'
import factory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

type ShaclPropertyProps = {
  pointer: GrapoiPointer
  isDragging?: boolean
  setRenderCount: React.Dispatch<React.SetStateAction<number>>
}

export default function ShaclProperty({ pointer, setRenderCount }: ShaclPropertyProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ShaclProperty',
    item: pointer.term,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop({
    accept: 'ShaclProperty',

    hover(shaclPropertyTerm, monitor) {
      if (!ref.current) return

      const shaclPropertyPointer = pointer.node(shaclPropertyTerm as NamedNode)
      const shOrderB = shaclPropertyPointer.out(sh('order')).value
      const orderB = shOrderB ? parseFloat(shOrderB) : 0

      const shOrderA = pointer.out(sh('order')).value
      const orderA = shOrderA ? parseFloat(shOrderA) : 0

      if (orderA === orderB) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return

      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (orderB < orderA && hoverClientY < hoverMiddleY) {
        return
      }
      if (orderA > orderB && hoverClientY > hoverMiddleY) {
        return
      }

      shaclPropertyPointer?.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(orderA.toString(), xsd('double'))])
      pointer?.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(orderB.toString(), xsd('double'))])
      setRenderCount((value) => value + 1)
    },
  })

  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  drag(drop(ref))

  return (
    <div className={`shacl-property ${isDragging ? 'is-dragging' : ''}`} ref={ref}>
      <span className="title">{label}</span>
    </div>
  )
}
