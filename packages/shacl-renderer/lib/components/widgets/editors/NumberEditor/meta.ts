import { DataFactory } from 'n3'
import { sh, xsd, sr } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export const iri = sr('NumberEditor')

export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (dataPointer.term && xsd('decimal').equals(dataPointer.term.datatype)) {
    return 10
  }

  if (dataPointer.term && xsd('integer').equals(dataPointer.term.datatype)) {
    return 10
  }

  if (xsd('decimal').equals(shaclPointer.out(sh('datatype')).term)) {
    return 5
  }

  if (xsd('integer').equals(shaclPointer.out(sh('datatype')).term)) {
    return 5
  }
}

// TODO Empty date objects are not seen as valid by the SHACL validator.
export const createTerm = () => {
  return DataFactory.literal('', xsd('integer'))
}
