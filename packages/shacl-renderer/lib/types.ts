import { NamedNode, Term, DatasetCore } from '@rdfjs/types'
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
  dataDataset: DatasetCore
  shaclDataset: DatasetCore
  widgetLoaders: Map<string, () => Promise<{ default: ReactElement }>>
  cssClasses: {
    hasErrors: string
    errorMessage: string
    formLevel: string
    group: string
    label: string
    input: string
    shaclProperty: string
    propertyObject: string
    propertyObjectWrapper: string
    button: {
      add: string
      remove: string
      primary: string
      secondary: string
      danger: string
    }
  }
}

export type WidgetProps = {
  term: Term
  setTerm: React.Dispatch<Term>
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  hasErrorsClassName?: string
  cssClass?: string
}
