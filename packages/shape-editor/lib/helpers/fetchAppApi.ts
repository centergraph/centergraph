import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'

export const fetchAppApi = async (appUrl: string): Promise<Array<WidgetMeta>> => {
  return fetch(appUrl)
    .then((response) => response.text())
    .then(async (indexHtml) => {
      const parser = new DOMParser()
      const document = parser.parseFromString(indexHtml, 'text/html')
      const relativeUrl = document.querySelector('[name="centergraph-widgets"]')!.getAttribute('content')!

      const url = new URL(relativeUrl, appUrl).toString()

      const module = await import(/* @vite-ignore */ url)

      /** @ts-expect-error this is a bit messy */
      const [, centerGraphApi]: [unknown, CenterGraph] = Object.entries(module).find(
        /** @ts-expect-error this is a bit messy */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_variable, instance]) => instance?.['centergraph'] === true
      )

      const widgetMetas = [
        ...centerGraphApi.shaclRendererSettings.widgetMetas.editors,
        ...centerGraphApi.shaclRendererSettings.widgetMetas.viewers,
      ]

      return widgetMetas
    })
}
