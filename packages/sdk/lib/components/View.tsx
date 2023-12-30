import { useEffect, useState } from 'react'
import '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/dist/style.css'

type ViewProps = {
  viewMode: string
  url: string
  shaclUrlPromise: Promise<string>
  fetch: (typeof globalThis)['fetch']
}

export default function View({ url, shaclUrlPromise, fetch }: ViewProps) {
  const [shaclUrl, setShaclUrl] = useState('')

  useEffect(() => {
    shaclUrlPromise.then(setShaclUrl)
  }, [shaclUrlPromise])

  return shaclUrl ? (
    <shacl-renderer
      ref={(element: HTMLElement) => element?.addEventListener('settings', (event: CustomEvent) => (event.detail.settings.fetch = fetch))}
      shacl-shapes-url={shaclUrl}
      data-url={url}
      mode="view"
    ></shacl-renderer>
  ) : null
}
