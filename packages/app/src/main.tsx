import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { api } from './centerGraph.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <api.AuthProvider>
      <App />
    </api.AuthProvider>
  </React.StrictMode>
)
