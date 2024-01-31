import { sh, xsd } from '@centergraph/shared/lib/namespaces'
import factory from '@rdfjs/data-model'

export const updateOrders = (pointers: GrapoiPointer[]) => {
  for (const [index, pointer] of [...pointers].entries()) {
    pointer.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(index.toString(), xsd('double'))])
  }
}
