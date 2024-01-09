import defaultCssClasses from './defaultCssClasses'
import datasetFactory from '@rdfjs/dataset'

export const defaultSettings = (mode: 'view' | 'edit') => ({
  fetch: fetch.bind(window),
  mode,
  widgetMetas: {
    editors: [],
    viewers: [],
  },
  widgetLoaders: new Map(),
  dataDataset: datasetFactory.dataset(),
  shaclDataset: datasetFactory.dataset(),
  cssClasses: defaultCssClasses(mode),
})
