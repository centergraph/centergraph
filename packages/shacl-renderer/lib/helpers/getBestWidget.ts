import { WidgetMeta } from '../types'

export const getBestWidget = (widgets: Array<WidgetMeta>, dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  const widgetMatches = widgets
    .map((widgetMeta) => ({
      iri: widgetMeta.iri,
      score: widgetMeta.score(dataPointer, shaclPointer) ?? 0,
    }))
    .sort((a, b) => b.score - a.score)

  return widgetMatches[0].iri.value
}
