import ReactDOM from 'react-dom/client'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'
import ContactsLayout from './routes/ContactsLayout.tsx'
import ViewContact from './routes/ViewContact.tsx'
import EditContact from './routes/EditContact.tsx'
import AddContact from './routes/AddContact.tsx'
import Search from './routes/Search.tsx'

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './routes/Home.tsx'
import Header from './components/header.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CenterGraph api={api}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="search" element={<Search />} />
          <Route path="/" element={<ContactsLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="contact/add" element={<AddContact />} />
            <Route path="contact/:slug" element={<ViewContact />} />
            <Route path="contact/:slug/edit" element={<EditContact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CenterGraph>
  </React.StrictMode>
)
