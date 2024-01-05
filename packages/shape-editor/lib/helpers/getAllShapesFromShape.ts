import { sh } from '@centergraph/shared/lib/namespaces'
import { NamedNode } from '@rdfjs/types'

export const getAllShapesFromShape = (pointer: GrapoiPointer, rootIri: NamedNode): NamedNode[] => {
  const rootPointer = pointer.node(rootIri)
  const nodes: GrapoiPointer[] = [...rootPointer.out(sh('property')).out(sh('node'))]

  const output: NamedNode[] = [rootIri]

  for (const node of nodes) {
    output.push(...getAllShapesFromShape(pointer, node.term))
  }

  return output
}
