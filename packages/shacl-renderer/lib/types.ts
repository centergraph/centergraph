import { NamedNode } from '@rdfjs/types'
import { ReactElement } from 'react'

export type WidgetMeta = {
  iri: NamedNode
  score: (shaclProperty: GrapoiPointer, data: GrapoiPointer) => number
  loader?: Promise<ReactElement>
}

export type Settings = {
  mode: 'edit' | 'view'
  fetch: typeof globalThis.fetch
  targetClass?: string
  widgetMetas: {
    editors: Array<WidgetMeta>
    viewers: Array<WidgetMeta>
  }
  widgetLoaders: Map<string, () => Promise<{ default: ReactElement }>>
}
