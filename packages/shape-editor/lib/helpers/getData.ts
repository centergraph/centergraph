import factory from '@rdfjs/data-model'
import { sh, sr } from '@centergraph/shared/lib/namespaces'
import { getAllShapesFromShape } from './getAllShapesFromShape'
import { sortPointersByShOrder } from './sortPointersByShOrder'
import { SortableState } from '../ShapeEditor'

const filterPropertyGroups = (propertyGroup: GrapoiPointer, grid: GrapoiPointer, region: string, regions: string[]) => {
  const gridArea = propertyGroup.out(sr('gridArea')).value
  if (region === '_undefined' && (!grid?.value || !regions.includes(gridArea))) return true
  if (region === '_undefined' && grid?.value) return gridArea === undefined
  return gridArea === region && regions.includes(region)
}

export const getData = (pointer: GrapoiPointer, baseIRI: string): SortableState => {
  const grid = pointer.out(sr('grid'))
  const regions = [...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? [])]
  const shapeIris = getAllShapesFromShape(pointer, factory.namedNode(baseIRI))
  const shapes = pointer.node(shapeIris)

  return ['_undefined', ...regions].map((region) => {
    return {
      type: 'region' as const,
      id: region,
      items: [...pointer.node([sh('PropertyGroup')]).in()]
        .filter((propertyGroup) => filterPropertyGroups(propertyGroup, grid, region, regions))
        .sort(sortPointersByShOrder)
        .map((propertyGroup: GrapoiPointer) => {
          const shaclProperties = [...(shapes?.out(sh('property')) ?? [])]
            .filter((property) => property.out(sh('group')).value === propertyGroup.term.value)
            .sort(sortPointersByShOrder)

          const relativePropertyIri = propertyGroup.term.value.replace(baseIRI + '#', '').replace(baseIRI, '')
          const groupId = `${region}:${relativePropertyIri}`

          return {
            type: 'group' as const,
            pointer: propertyGroup,
            id: groupId,
            items: shaclProperties.map((shaclProperty) => {
              return {
                type: 'property' as const,
                pointer: shaclProperty,
                id: `${groupId}:${shaclProperty.term.value}`,
              }
            }),
          }
        }),
    }
  })
}
