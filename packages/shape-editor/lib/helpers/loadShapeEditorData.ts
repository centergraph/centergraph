import grapoi from 'grapoi'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import { sh, sr } from '@centergraph/shared/lib/namespaces'
import { resetOrders } from './resetOrders'
import { getAllShapesFromShape } from './getAllShapesFromShape'
import { sortPointersByShOrder } from './sortPointersByShOrder'
import { SortableState } from '../ShapeEditor'

export type GridData = {
  hasGrid: boolean
  gridTemplateAreas: string
  gridTemplateRows: string
  gridTemplateColumns: string
  regions: Array<string>
}

export const loadShapeEditorData = async (
  shaclShapesUrl: string
): Promise<
  {
    pointer: GrapoiPointer
    initialData: SortableState
  } & GridData
> => {
  return fetch(shaclShapesUrl.split('#')[0])
    .then((response) => response.text())
    .then(async (turtle) => {
      const url = new URL(shaclShapesUrl, location.origin)

      const parser = new Parser({
        baseIRI: url.toString(),
      })
      const quads = await parser.parse(turtle)
      const dataset = datasetFactory.dataset(quads)
      const pointer = grapoi({ dataset, factory, term: factory.namedNode(url.toString()) })
      const propertyGroups = pointer?.node([sh('PropertyGroup')]).in() ?? []

      resetOrders(propertyGroups)

      const grid = pointer?.out(sr('grid'))
      const regions = [...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? [])]

      const gridTemplateAreas = grid?.out(sr('grid-template-areas')).value
      const gridTemplateRows = grid?.out(sr('grid-template-rows')).value
      const gridTemplateColumns = grid?.out(sr('grid-template-columns')).value

      const shapeIris = getAllShapesFromShape(pointer, factory.namedNode(url.toString()))
      const shapes = pointer?.node(shapeIris)

      const mapPropertyGroup = (propertyGroup: GrapoiPointer) => {
        const shaclProperties = [...(shapes?.out(sh('property')) ?? [])].filter(
          (property) => property.out(sh('group')).value === propertyGroup.term.value
        )
        return [propertyGroup.term.value, shaclProperties.sort(sortPointersByShOrder)]
      }

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
          .map(mapPropertyGroup)
      }

      const initialData = Object.fromEntries(
        ['_undefined', ...regions].map((region) => {
          return [region, Object.fromEntries(getPropertyGroups(region))]
        })
      )

      return {
        pointer,
        hasGrid: !!grid.value,
        gridTemplateAreas,
        gridTemplateRows,
        gridTemplateColumns,
        regions,
        initialData,
      }
    })
}
