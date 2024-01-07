import { sh, xsd } from '@centergraph/shared/lib/namespaces'
import { sortPointersByShOrder } from './sortPointersByShOrder'
import factory from '@rdfjs/data-model'

export const resetOrders = (propertyGroups: GrapoiPointer | GrapoiPointer) => {
  for (const propertyGroup of [...propertyGroups]) {
    const shaclProperties = [...propertyGroup.in()].sort(sortPointersByShOrder)

    shaclProperties.forEach((pointer, index) => {
      pointer.deleteOut(sh('order')).addOut(sh('order'), [factory.literal(index.toString(), xsd('double'))])
    })
  }
}
