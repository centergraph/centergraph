import { dash, rdf, sh, xsd } from '../../../../helpers/namespaces'

export const iri = dash('TextFieldEditor')

//  Score: 10 if the value is a literal that is neither rdf:langString nor xsd:boolean. 0 otherwise.
export const score = (shaclPointer: GrapoiPointer, dataPointer: GrapoiPointer) => {
  if (
    dataPointer.term &&
    dataPointer.term.termType === 'Literal' &&
    !rdf('langString').equals(dataPointer.term.datatype) &&
    xsd('boolean').equals(dataPointer.term.datatype)
  ) {
    return 10
  }

  if (xsd('string').equals(shaclPointer.out(sh('datatype')).term)) {
    return 10
  }
}
