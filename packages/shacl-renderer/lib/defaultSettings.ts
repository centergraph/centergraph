import defaultCssClasses from './defaultCssClasses'
import datasetFactory from '@rdfjs/dataset'

export const defaultSettings = (mode: 'view' | 'edit') => ({
  fetch: fetch.bind(window),
  mode,
  targetClass: 'https://schema.org/Person',
  widgetMetas: {
    editors: [],
    viewers: [],
  },
  widgetLoaders: new Map(),
  dataDataset: datasetFactory.dataset(),
  shaclDataset: datasetFactory.dataset(),
  cssClasses: defaultCssClasses(mode),
})
