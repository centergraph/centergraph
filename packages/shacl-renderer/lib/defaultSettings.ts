import defaultCssClasses from './defaultCssClasses'
import { Settings } from './types'

export const defaultSettings = (mode: 'view' | 'edit'): Settings => ({
  fetch: fetch.bind(window),
  mode,
  widgetMetas: {
    editors: [],
    viewers: [],
  },
  widgetLoaders: new Map(),
  cssClasses: {
    edit: defaultCssClasses('edit'),
    view: defaultCssClasses('view'),
  },
})
