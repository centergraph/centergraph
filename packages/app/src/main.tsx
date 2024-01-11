import React from 'react'
import ReactDOM from 'react-dom/client'
import { api } from './centerGraph.ts'
import CenterGraph from '@centergraph/sdk/lib/react/context/Provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import ViewContact from './ViewContact.tsx'
import EditContact from './EditContact.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'contact/:slug',
        element: <ViewContact />,
      },
      {
        path: 'contact/:slug/edit',
        element: <EditContact />,
      },
    ],
  },
])

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CenterGraph api={api}>
        <RouterProvider router={router} />
      </CenterGraph>
    </React.StrictMode>
  )
})
