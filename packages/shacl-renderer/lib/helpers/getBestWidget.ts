import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'

export const getBestWidget = (widgets: Array<WidgetMeta>, dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  const widgetMatches = widgets
    .map((widgetMeta) => {
      const score = widgetMeta.score(dataPointer, shaclPointer)

      return {
        iri: widgetMeta.iri,
        score: score === undefined ? -1 : score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .filter(({ score }) => score > -1)

  return widgetMatches[0]?.iri.value
}
