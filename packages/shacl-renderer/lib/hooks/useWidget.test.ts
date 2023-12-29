import { expect, test } from 'vitest'
import datasetFactory from '@rdfjs/dataset'
import { useWidget, widgetCache } from './useWidget'
import { prepare } from '@/helpers/getBestWidget.test'
import { Settings } from '@/types'
import defaultCssClasses from '@/defaultCssClasses'
import { DataFactory } from 'n3'
import { rdf, schema, sh } from '@/helpers/namespaces'
import grapoi from 'grapoi'
import { renderHook } from '@testing-library/react-hooks/server'
import LiteralViewer from '@/components/widgets/viewers/LiteralViewer'

test('that it gives the iri', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepare('edit')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: targetMetas,
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('edit'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('birthDate')).value)

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer))
  expect(output.result.current.widgetIri).toBe('http://datashapes.org/dash#DatePickerEditor')
})

test('that it loads editors', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepare('edit')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: targetMetas,
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('edit'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('birthDate')).value)

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer, true))
  output.hydrate()
  await output.waitForNextUpdate()
  expect(output.result.current.Widget.name).toBe('DatePickerEditor')
  expect(output.result.current.widgetIri).toBe('http://datashapes.org/dash#DatePickerEditor')
})

test('that it loads viewers', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepare('view')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'view',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: targetMetas,
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('view'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer, true))
  output.hydrate()
  await output.waitForNextUpdate()

  expect(output.result.current.Widget.name).toBe('LiteralViewer')
  expect(output.result.current.widgetIri).toBe('http://datashapes.org/dash#LiteralViewer')
})

test('that it mails with no viewers', async () => {
  const { shaclPointer, loaders } = await prepare('view')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'view',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('view'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer, true))
  output.hydrate()

  expect(output.result.current).toStrictEqual({
    Widget: undefined,
    widgetIri: undefined,
    widgetMeta: undefined,
  })
})

test('that it only continues if the module is available', async () => {
  const { shaclPointer, loaders } = await prepare('view')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'view',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('view'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  specificShaclPointer.addOut(sh('viewer'), sh('unknown'))

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer, true))
  output.hydrate()

  expect(output.result.current).toStrictEqual({
    Widget: undefined,
    widgetIri: 'http://www.w3.org/ns/shacl#unknown',
    widgetMeta: undefined,
  })
})

test.only('that it uses cache if available', async () => {
  const { shaclPointer, loaders } = await prepare('view')

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'view',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('view'),
  }

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  specificShaclPointer.addOut(sh('viewer'), sh('unknown'))
  widgetCache.set('http://www.w3.org/ns/shacl#unknown', LiteralViewer)

  const output = renderHook(() => useWidget(settings, dataPointer, specificShaclPointer, true))
  output.hydrate()

  expect(output.result.current).toStrictEqual({
    Widget: LiteralViewer,
    widgetIri: 'http://www.w3.org/ns/shacl#unknown',
    widgetMeta: undefined,
  })
})
