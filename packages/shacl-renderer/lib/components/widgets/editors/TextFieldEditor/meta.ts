import { DataFactory } from 'n3'
import { dash, rdf, sh, xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
// import widgetForm from '@centergraph/shacl-renderer/lib/widget.ttl?raw'

export const iri = dash('TextFieldEditor')

//  Score: 10 if the value is a literal that is neither rdf:langString nor xsd:boolean. 0 otherwise.
export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (
    dataPointer.term &&
    dataPointer.term.value &&
    dataPointer.term.termType === 'Literal' &&
    !rdf('langString').equals(dataPointer.term.datatype) &&
    !xsd('boolean').equals(dataPointer.term.datatype)
  ) {
    return 10
  }

  if (xsd('string').equals(shaclPointer.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => DataFactory.literal('')

export const formParts = [
  // widgetForm
]
