import { getBestWidget } from './getBestWidget'
import { expect, test } from 'vitest'
import { registerWidgets } from './registerWidgets'
import { WidgetMeta } from '@/types'
import { ReactElement } from 'react'
import grapoi from 'grapoi'
import { DataFactory, Parser } from 'n3'
import { rdf, schema, sh } from './namespaces'
import datasetFactory from '@rdfjs/dataset'
import ContactShape from '@/../public/shapes/contact.shacl.ttl?raw'

const prepare = async () => {
  const loaders: Map<string, () => Promise<{ default: ReactElement }>> = new Map()
  const targetMetas: Array<WidgetMeta> = []

  const editorPromises = registerWidgets({
    targetMetas,
    loaders,
    metasGlob: import.meta.glob('@/components/widgets/editors/*/meta.ts'),
    modulesGlob: import.meta.glob('@/components/widgets/editors/*/index.tsx'),
  })

  await Promise.all(editorPromises)

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })

  const parser = new Parser()
  const quads = await parser.parse(ContactShape)
  const shaclDataset = datasetFactory.dataset(quads)
  const shaclPointer = grapoi({ dataset: shaclDataset, factory: DataFactory })
  return { dataPointer, shaclPointer, targetMetas }
}

test('getting the best widget appropriate for a date field', async () => {
  const { targetMetas, shaclPointer, dataPointer } = await prepare()
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('birthDate')).value)

  const iri = getBestWidget(targetMetas, dataPointer, specificShaclPointer)
  expect(iri).toBe('http://datashapes.org/dash#DatePickerEditor')
})

test('getting the best widget appropriate for a text field', async () => {
  const { targetMetas, shaclPointer, dataPointer } = await prepare()
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  const iri = getBestWidget(targetMetas, dataPointer, specificShaclPointer)
  expect(iri).toBe('http://datashapes.org/dash#TextFieldEditor')
})
