import grapoi from 'grapoi'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import factory from '@rdfjs/data-model'
import { sh, sr, srl, se, schema } from '@centergraph/shared/lib/namespaces'
import { resetOrders } from './resetOrders'
import { SortableState } from '../ShapeEditor'
import { getData } from './getData'

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
    app: GrapoiPointer
    initialData: SortableState
  } & GridData
> => {
  return fetch(shaclShapesUrl.split('#')[0])
    .then((response) => response.text())
    .then(async (turtle) => {
      const baseIRI = new URL(shaclShapesUrl, location.origin).toString()

      const parser = new Parser({ baseIRI })
      const quads = await parser.parse(turtle)
      const dataset = datasetFactory.dataset(quads)
      const pointer = grapoi({ dataset, factory, term: factory.namedNode(baseIRI) })
      const propertyGroups = pointer?.node([sh('PropertyGroup')]).in() ?? []
      resetOrders(propertyGroups)

      const shaclProperties = pointer?.out(sh('property'))
      resetOrders(shaclProperties)

      const grid = pointer.out(sr('grid'))
      const app = pointer.out(se('app'))

      if (grid?.term?.value.startsWith(srl().value)) {
        // TODO load it from the absolute URL.
        const layoutsTurtle = await fetch('/shapes/layouts.ttl').then((response) => response.text())
        const parser = new Parser({
          baseIRI: 'https://centergraph.danielbeeke.nl/layouts#',
        })
        const quads = await parser.parse(layoutsTurtle)
        for (const quad of quads) dataset.add(quad)
      }

      const regions = [
        ...new Set(grid?.out(sr('grid-template-areas')).value?.replace(/'|"/g, ' ').split(' ').filter(Boolean) ?? []),
      ]

      const gridTemplateAreas = grid?.out(sr('grid-template-areas')).value
      const gridTemplateRows = grid?.out(sr('grid-template-rows')).value
      const gridTemplateColumns = grid?.out(sr('grid-template-columns')).value
      const gridLabel = grid?.out(schema('name')).value

      const initialData = getData(pointer, baseIRI)

      return {
        pointer,
        hasGrid: !!grid.value,
        gridTemplateAreas,
        gridTemplateRows,
        gridLabel,
        gridTemplateColumns,
        regions,
        initialData,
        app,
      }
    })
}
