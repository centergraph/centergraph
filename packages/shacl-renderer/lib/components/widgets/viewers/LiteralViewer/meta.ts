import { dash, sh, xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
// import widgetForm from '@centergraph/shacl-renderer/lib/widget.ttl?raw'

export const iri = dash('LiteralViewer')

export const score = (dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  if (dataPointer.term && dataPointer.term.termType === 'Literal') {
    return 1
  }

  // sh:datatype xsd:string

  if (xsd('string').equals(shaclPointer.out(sh('datatype')).term)) {
    return 1
  }
}

export const formParts = [
  // widgetForm
]
