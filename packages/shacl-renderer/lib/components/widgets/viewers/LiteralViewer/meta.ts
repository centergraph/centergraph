import { dash } from '@/helpers/namespaces'

export const iri = dash('LiteralViewer')

export const score = (dataPointer: GrapoiPointer) => {
  if (dataPointer.term && dataPointer.term.termType === 'Literal') {
    return 1
  }
}
