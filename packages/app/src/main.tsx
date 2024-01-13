import ReactDOM from 'react-dom/client'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'
import App from './routes/App.tsx'
import ViewContact from './routes/ViewContact.tsx'
import EditContact from './routes/EditContact.tsx'
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SuspenseRouter from '@centergraph/sdk/lib/react/components/SuspenseRouter'
import Home from './Home.tsx'

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CenterGraph api={api}>
        <SuspenseRouter window={window}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="/" element={<Home />} />
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
