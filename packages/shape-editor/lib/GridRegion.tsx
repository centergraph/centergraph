import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { NamedNode } from '@rdfjs/types'
import { ReactNode } from 'react'

export default function GridRegion({
  children,
  name,
  setRenderCount,
}: {
  children?: ReactNode
  name: string
  setRenderCount: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div style={{ gridArea: name }} className={`grid-region grid-region-${name}`}>
      <span className="name">Region: {name}</span>
      {children}
    </div>
  )
}
