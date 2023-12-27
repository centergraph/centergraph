import { ReactElement } from 'react'
import { WidgetMeta } from '@/types'

export type LoadWidgetsProps = {
  targetMetas: Array<WidgetMeta>
  loaders: Map<string, () => Promise<{ default: ReactElement }>>
  metasGlob: Record<string, () => Promise<unknown>>
  modulesGlob: Record<string, () => Promise<unknown>>
}

export const loadWidgets = ({ targetMetas, loaders, metasGlob, modulesGlob }: LoadWidgetsProps) => {
  return Object.entries(metasGlob).map(async ([path, metaPromise]) => {
    const meta = (await metaPromise()) as WidgetMeta
    const pathParts = path.split('/')
    pathParts.pop()
    const pathPrefix = pathParts.join('/')

    const module = Object.entries(modulesGlob).find(([path]) => path.startsWith(pathPrefix))
    loaders.set(meta.iri.value, module?.[1] as unknown as () => Promise<{ default: ReactElement }>)
    targetMetas.push(meta)
  })
}
