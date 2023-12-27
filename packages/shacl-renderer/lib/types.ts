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
  cssClasses: {
    formLevel: string
    group: string
    label: string
    input: string
    shaclProperty: string
    button: {
      primary: string
      secondary: string
    }
  }
}

export type WidgetProps = {
  term: Term
  setTerm: React.Dispatch<Term>
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
}
