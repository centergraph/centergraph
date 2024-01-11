import { NamedNode, Term, DatasetCore } from '@rdfjs/types'
import { ReactElement } from 'react'

export type WidgetMeta = {
  iri: NamedNode
  score: (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => number
  createTerm?: () => Term
  loader?: Promise<ReactElement>
  formParts?: string[]
}

export type CssClasses = {
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

export type Settings = {
  mode: 'edit' | 'view'
  fetch: typeof globalThis.fetch
  targetClass?: string
  widgetMetas: {
    editors: Array<WidgetMeta>
    viewers: Array<WidgetMeta>
  }
  initialDataDataset?: DatasetCore
  initialShaclDataset?: DatasetCore
  widgetLoaders: Map<string, () => Promise<{ default: ReactElement }>>
  cssClasses: {
    edit: CssClasses
    view: CssClasses
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
