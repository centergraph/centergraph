import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { CSSProperties } from 'react'

export default function ShaclProperty(props: { pointer: GrapoiPointer; id: string; style?: CSSProperties }) {
  const { pointer } = props

  const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

  return (
    <div className="shacl-property" {...props}>
      <span className="title">{label}</span>
    </div>
  )
}
