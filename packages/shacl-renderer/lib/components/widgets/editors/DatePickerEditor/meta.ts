import { DataFactory } from 'n3'
import { dash, sh, xsd } from '../../../../helpers/namespaces'

export const iri = dash('DatePickerEditor')

export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (dataPointer.term && xsd('date').equals(dataPointer.term.datatype)) {
    return 10
  }

  if (xsd('date').equals(shaclPointer.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => DataFactory.literal('', xsd('date'))
