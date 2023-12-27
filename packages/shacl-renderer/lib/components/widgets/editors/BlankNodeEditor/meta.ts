import { DataFactory } from 'n3'
import { dash, sh } from '../../../../helpers/namespaces'

export const iri = dash('BlankNodeEditor')

export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (!shaclPointer.out(sh('node')).value) return -1

  if (dataPointer.term && dataPointer.term.termType === 'BlankNode') {
    return 1
  }

  if (sh('BlankNode').equals(shaclPointer.out(sh('nodeKind')).term)) {
    return 1
  }
}

export const createTerm = () => DataFactory.blankNode()
