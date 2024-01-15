import ReactDOM from 'react-dom/client'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'
import ContactsLayout from './routes/ContactsLayout.tsx'
import ViewContact from './routes/ViewContact.tsx'
import EditContact from './routes/EditContact.tsx'
import AddContact from './routes/AddContact.tsx'

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home.tsx'

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CenterGraph api={api}>
        <Routes>
          <Route path="/" element={<ContactsLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="contact/add" element={<AddContact />} />
            <Route path="contact/:slug" element={<ViewContact />} />
            <Route path="contact/:slug/edit" element={<EditContact />} />
          </Route>
        </Routes>
      </CenterGraph>
    </React.StrictMode>
  )
})
