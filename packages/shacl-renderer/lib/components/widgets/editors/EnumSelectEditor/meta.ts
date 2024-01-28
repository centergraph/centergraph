import { DataFactory } from 'n3'
import { dash, sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export const iri = dash('EnumSelectEditor')

export const score = (_dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (shaclPointer.out(sh('in')).isList()) {
    return 10
  }
}

export const createTerm = () => DataFactory.namedNode('')
