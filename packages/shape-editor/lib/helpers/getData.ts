import factory from '@rdfjs/data-model'
import { sh, sr } from '@centergraph/shared/lib/namespaces'
import { getAllShapesFromShape } from './getAllShapesFromShape'
import { sortPointersByShOrder } from './sortPointersByShOrder'
import { SortableState } from '../ShapeEditor'

export const getData = (pointer: GrapoiPointer, baseIRI: string): SortableState => {
  const grid = pointer?.out(sr('grid'))
  const regions = [...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? [])]

  const shapeIris = getAllShapesFromShape(pointer, factory.namedNode(baseIRI))
  const shapes = pointer?.node(shapeIris)

  const getPropertyGroups = (filterGridArea: string) => {
    const allPropertyGroups = [...(pointer?.node([sh('PropertyGroup')]).in() ?? [])]
    return allPropertyGroups
      .filter((propertyGroup) => {
        const gridArea = propertyGroup.out(sr('gridArea')).value
        if (filterGridArea === '_undefined' && !grid?.value) return true
        if (filterGridArea === '_undefined' && grid?.value) return gridArea === undefined
        return gridArea === filterGridArea
      })
      .sort(sortPointersByShOrder)
      .map((propertyGroup: GrapoiPointer) => {
        const shaclProperties = [...(shapes?.out(sh('property')) ?? [])]
          .filter((property) => property.out(sh('group')).value === propertyGroup.term.value)
          .sort(sortPointersByShOrder)

        const relativePropertyIri = propertyGroup.term.value.replace(baseIRI + '#', '').replace(baseIRI, '')
        const groupId = `${filterGridArea}:${relativePropertyIri}`

        return {
          type: 'group' as const,
          pointer: propertyGroup,
          id: groupId,
          children: shaclProperties.map((shaclProperty) => {
            return {
              type: 'property' as const,
              pointer: shaclProperty,
              id: `${groupId}:${shaclProperty.term.value}`,
            }
          }),
        }
      })
  }

  return ['_undefined', ...regions].map((region) => {
    return {
      type: 'region' as const,
      id: region,
      children: getPropertyGroups(region),
    }
  })
}
