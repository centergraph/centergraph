import { DataFactory } from 'n3'
import { dash, sh, xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export const iri = dash('BooleanSelectEditor')

//  Score: 10 if the value is a literal that is neither rdf:langString nor xsd:boolean. 0 otherwise.
export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (
    dataPointer.term &&
    dataPointer.term.value &&
    dataPointer.term.termType === 'Literal' &&
    xsd('boolean').equals(dataPointer.term.datatype)
  ) {
    return 10
  }

  if (xsd('boolean').equals(shaclPointer.out(sh('datatype')).term)) {
    return 10
  }
}

export const createTerm = () => DataFactory.literal('', xsd('boolean'))
