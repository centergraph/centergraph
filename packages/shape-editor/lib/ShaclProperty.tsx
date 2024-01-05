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
  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  return (
    <div className={`shacl-property`}>
      <span className="title">{label}</span>
    </div>
  )
}
