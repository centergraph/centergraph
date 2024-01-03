import { DataFactory } from 'n3'
import { dash, sh, xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export const iri = dash('DatePickerEditor')

export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (dataPointer.term && xsd('date').equals(dataPointer.term.datatype)) {
    return 10
  }

  if (xsd('date').equals(shaclPointer.out(sh('datatype')).term)) {
    return 5
  }
}

// TODO Empty date objects are not seen as valid by the SHACL validator.
export const createTerm = () => {
  return DataFactory.literal('', xsd('date'))
}
