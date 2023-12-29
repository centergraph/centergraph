import { expect, test } from 'vitest'
import datasetFactory from '@rdfjs/dataset'
import { widgetCache } from '@/hooks/useWidget'
import { preloadWidgets } from './preloadWidgets'
import { Settings } from '@/types'
import defaultCssClasses from '@/defaultCssClasses'
import { prepare } from './getBestWidget.test'

test('preloads widgets', async () => {
  const { shaclPointer, targetMetas, loaders } = await prepare()

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
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('edit'),
  }

  await preloadWidgets(settings, shaclPointer)
  expect(widgetCache.size).toBe(3)
})
