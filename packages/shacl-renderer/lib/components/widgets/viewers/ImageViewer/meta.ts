import { dash } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import imageWidgetForm from './widget.ttl?raw'

export const iri = dash('ImageViewer')

export const score = (dataPointer: GrapoiPointer) => {
  const extension = dataPointer.term?.value.split('.').pop()?.toLowerCase()

  if (dataPointer.term && dataPointer.term.termType === 'Literal' && ['png', 'jpg', 'jpeg'].includes(extension)) {
    return 15
  }
}

export const formParts = [imageWidgetForm]
