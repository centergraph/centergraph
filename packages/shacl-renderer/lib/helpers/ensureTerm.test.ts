import { expect, test } from 'vitest'
import { ensureTerm } from './ensureTerm'
import { schema } from './namespaces'
import grapoi from 'grapoi'
import datasetFactory from '@rdfjs/dataset'
import { DataFactory } from 'n3'
import * as widgetMeta from '@/components/widgets/editors/TextFieldEditor/meta'
import { WidgetMeta } from '@/types'

test('it ensure a new term', () => {
  const path = [
    {
      predicates: [schema('name')],
    },
  ]

  const dataPointer = grapoi({ dataset: datasetFactory.dataset(), factory: DataFactory })

  ensureTerm(path, dataPointer, { ...widgetMeta } as WidgetMeta, () => {
    expect(dataPointer.ptrs[0].dataset.size).toBe(1)
  })
})

test('when data is available it skips', () => {
  const path = [
    {
      predicates: [schema('name')],
    },
  ]

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))

  const dataset = datasetFactory.dataset([quad])

  const dataPointer = grapoi({ dataset, factory: DataFactory })

  ensureTerm(path, dataPointer, { ...widgetMeta } as WidgetMeta, () => {})
  expect(dataPointer.ptrs[0].dataset.size).toBe(1)
  const [datasetQuad] = [...dataPointer.ptrs[0].dataset]
  expect(quad.equals(datasetQuad)).toBeTruthy()
})
