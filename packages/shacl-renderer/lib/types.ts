import { NamedNode, Term } from '@rdfjs/types'
import { Store } from 'n3'
import { ReactElement } from 'react'

export type WidgetMeta = {
  iri: NamedNode
  score: (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => number
  createTerm?: () => Term
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
  dataStore: Store
  widgetLoaders: Map<string, () => Promise<{ default: ReactElement }>>
}

export type WidgetProps = {
  term: Term
  setTerm: React.Dispatch<Term>
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
}
