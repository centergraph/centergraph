import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import { Term } from '@rdfjs/types'
import { markTermAsEmpty } from '@centergraph/shacl-renderer/lib/helpers/markTermAsEmpty'

export const ensureTerm = (
  path: Array<{ predicates: Array<Term> }>,
  dataPointer: GrapoiPointer,
  widgetMeta: WidgetMeta,
  callback: () => void
) => {
  if (!dataPointer.executeAll(path).ptrs.length && path.length === 1 && path[0].predicates?.length === 1) {
    dataPointer.addOut([path[0].predicates[0]], [markTermAsEmpty(widgetMeta!.createTerm!())])
    callback()
  }
}
