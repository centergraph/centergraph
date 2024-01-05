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
  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  return (
    <details className={`shacl-group`}>
      <summary className="title">Group: {label}</summary>
      {children}
    </details>
  )
}
