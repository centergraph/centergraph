import { WidgetMeta } from '../types'

export const getBestWidget = (widgets: Array<WidgetMeta>, shaclPointer: GrapoiPointer, dataPointer: GrapoiPointer) => {
  const widgetMatches = widgets
    .map((widgetMeta) => ({
      iri: widgetMeta.iri,
      score: widgetMeta.score(shaclPointer, dataPointer),
    }))
    .sort((a, b) => a.score - b.score)

  return widgetMatches[0].iri.value
}
