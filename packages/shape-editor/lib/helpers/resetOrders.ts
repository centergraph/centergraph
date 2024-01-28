import { sh, xsd } from '@centergraph/shared/lib/namespaces'
import factory from '@rdfjs/data-model'

export const resetOrders = (items: GrapoiPointer | GrapoiPointer[]) => {
  for (const [index, item] of [...items].entries()) {
    item.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(index.toString(), xsd('double'))])
  }
}
