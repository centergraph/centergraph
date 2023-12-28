import { Settings } from '@/types'
import { sh } from './namespaces'
import { DataFactory, Store } from 'n3'
import { getBestWidget } from '@/helpers/getBestWidget'
import { widgetCache } from '@/hooks/useWidget'
import grapoi from 'grapoi'

/**
 * TODO re-evaluate this structure
 */
export const preloadWidgets = async (settings: Settings, shaclPointer: GrapoiPointer) => {
  const properties = shaclPointer.out([sh('property')])
  const emptyGrapoi = grapoi({ dataset: new Store(), factory: DataFactory })
  const shWidget = settings.mode === 'edit' ? 'editor' : 'viewer'
  const widgets = settings.widgetMetas[settings.mode === 'edit' ? 'editors' : 'viewers']
  for (const property of properties) {
    if (property.hasOut(sh(shWidget)).value) continue
    const iri = getBestWidget(widgets, emptyGrapoi, property)

    if (iri) {
      property.addOut(sh(shWidget), DataFactory.namedNode(iri))
    }
  }

  const widgetIris = new Set(shaclPointer.out(sh('property')).out(sh(shWidget)).values)

  for (const widgetIri of widgetIris) {
    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (!widgetModule) continue
    widgetModule().then((module) => widgetCache.set(widgetIri, module.default))
  }
}
