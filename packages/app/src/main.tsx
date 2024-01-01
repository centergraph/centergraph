import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from 'react-oidc-context'

const oidcConfig = {
  authority: 'http://localhost:8000/oidc/',
  client_id: 'oidc_client',
  client_secret: 'a_different_secret',
  redirect_uri: 'http://localhost:8001/redirect',
  scope: 'openid profile',
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
