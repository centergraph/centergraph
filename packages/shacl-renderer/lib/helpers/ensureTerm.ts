import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import { Term } from '@rdfjs/types'

export const ensureTerm = (
  path: Array<{ predicates: Array<Term> }>,
  dataPointer: GrapoiPointer,
  widgetMeta: WidgetMeta,
  callback: () => void
) => {
  if (!dataPointer.executeAll(path).ptrs.length && path.length === 1 && path[0].predicates?.length === 1) {
    dataPointer.addOut([path[0].predicates[0]], [widgetMeta!.createTerm!()])
    callback()
  }
}
