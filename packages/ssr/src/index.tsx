import App from '@centergraph/app/src/App.tsx'
import { api } from '@centergraph/app/src/centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider.tsx'
import React from 'react'
import { renderToReadableStream } from 'react-dom/server'

const headers = {
  headers: {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-transform',
  },
}

Deno.serve({ port: 8005 }, async () => {
  return new Response(
    await renderToReadableStream(
      <CenterGraph api={api}>
        <App />
      </CenterGraph>
    ),
    headers
  )
})

console.log(`Ready: CenterGraph SSR is running on http://localhost:8005/`)
