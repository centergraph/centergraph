import { expect, test } from 'vitest'
import datasetFactory from '@rdfjs/dataset'
import { widgetCache } from '@centergraph/shacl-renderer/lib/hooks/useWidget'
import { preloadWidgets } from './preloadWidgets'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import defaultCssClasses from '@centergraph/shacl-renderer/lib/defaultCssClasses'
import { prepareTestState } from './prepareTestState'

test('preloads editor widgets', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepareTestState('edit')

  expect(widgetCache.size).toBe(0)

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: targetMetas,
      viewers: [],
    },
    widgetLoaders: loaders,
    cssClasses: {
      edit: defaultCssClasses('edit'),
      view: defaultCssClasses('view'),
    },
  }

  await preloadWidgets(settings, shaclPointer)
  expect(widgetCache.size).toBe(3)
  widgetCache.clear()
})

test('preloads viewer widgets', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepareTestState('view')

  expect(widgetCache.size).toBe(0)

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'view',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: targetMetas,
    },
    widgetLoaders: loaders,
    initialDataDataset: datasetFactory.dataset(),
    initialShaclDataset: datasetFactory.dataset(),
    cssClasses: {
      edit: defaultCssClasses('edit'),
      view: defaultCssClasses('view'),
    },
  }

  await preloadWidgets(settings, shaclPointer)
  expect(widgetCache.size).toBe(2)
  widgetCache.clear()
})
