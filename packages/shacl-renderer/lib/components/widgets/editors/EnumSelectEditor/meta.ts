import { DataFactory } from 'n3'
import { dash, sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
// import widgetForm from '@centergraph/shacl-renderer/lib/widget.ttl?raw'

export const iri = dash('EnumSelectEditor')

export const score = (_dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (shaclPointer.out(sh('in')).isList()) {
    return 10
  }
}

export const createTerm = () => DataFactory.namedNode('')

export const formParts = [
  // widgetForm
]
