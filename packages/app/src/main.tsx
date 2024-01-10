import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'

globalThis.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CenterGraph api={api}>
        <App />
      </CenterGraph>
    </React.StrictMode>
  )
})
