import { dash } from '../../../../helpers/namespaces'

export const iri = dash('TextFieldEditor')

//  Score: 10 if the value is a literal that is neither rdf:langString nor xsd:boolean. 0 otherwise.
export const score = (property: GrapoiPointer, data: GrapoiPointer) => {
  return 10
}
