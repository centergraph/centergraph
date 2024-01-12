import ReactDOM from 'react-dom/client'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'
import App from './App.tsx'
import ViewContact from './ViewContact.tsx'
import EditContact from './EditContact.tsx'
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SuspenseRouter from '@centergraph/sdk/lib/react/components/SuspenseRouter'

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CenterGraph api={api}>
        <SuspenseRouter window={window}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="contact/:slug" element={<ViewContact />} />
                <Route path="contact/:slug/edit" element={<EditContact />} />
              </Route>
            </Routes>
          </Suspense>
        </SuspenseRouter>
      </CenterGraph>
    </React.StrictMode>
  )
})
