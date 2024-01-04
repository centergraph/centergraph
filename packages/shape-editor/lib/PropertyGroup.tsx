import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { NamedNode } from '@rdfjs/types'
import { ReactNode } from 'react'
import { useDrop } from 'react-dnd'

export default function PropertyGroup({
  children,
  pointer,
  setRenderCount,
}: {
  children?: ReactNode
  pointer: GrapoiPointer
  setRenderCount: React.Dispatch<React.SetStateAction<number>>
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ShaclProperty',
    drop: (shaclPropertyTerm: NamedNode) => {
      pointer.node(shaclPropertyTerm)?.deleteOut(sh('group')).addOut(sh('group'), pointer.term)
      setRenderCount((value) => value + 1)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  return (
    <div className={`shacl-group ${isOver ? 'is-over' : ''}`} ref={drop}>
      <span className="title">{label}</span>
      {children}
    </div>
  )
}
