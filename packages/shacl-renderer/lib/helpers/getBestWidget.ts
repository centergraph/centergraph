import { WidgetMeta } from '../types'

export const getBestWidget = (widgets: Array<WidgetMeta>, dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer) => {
  const widgetMatches = widgets
    .map((widgetMeta) => ({
      iri: widgetMeta.iri,
      score: widgetMeta.score(dataPointer, shaclPointer) ?? -1,
    }))
    .filter(({ score }) => score > -1)
    .sort((a, b) => b.score - a.score)

  return widgetMatches[0]?.iri.value
}
