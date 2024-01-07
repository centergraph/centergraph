import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { CSSProperties, ForwardedRef, forwardRef } from 'react'

export const ShaclProperty = forwardRef(
  (props: { pointer: GrapoiPointer; id: string; style?: CSSProperties }, ref: ForwardedRef<HTMLDivElement>) => {
    const { pointer } = props

    const label = pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer.term.id.split(/\/|#/g).pop()

    return (
      <div className="shacl-property" {...props} ref={ref}>
        <span className="title">{label}</span>
      </div>
    )
  }
)
