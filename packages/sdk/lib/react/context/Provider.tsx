import { Suspense, ReactNode, useEffect, useState } from 'react'
import { centerGraphContext } from '.'
import { CenterGraph } from '../../CenterGraph'
import { AuthProvider } from 'react-oidc-context'
import AuthHandler from '../components/AuthHandler'

type ContextProviderProps = {
  api: CenterGraph
  children: ReactNode
}

const oidcConfig = {
  authority: 'http://localhost:8000/oidc/',
  client_id: 'centergraph',
  redirect_uri: 'http://localhost:8001',
  scope: 'openid profile',
}

export default function CenterGraphContextProvider({ children, api }: ContextProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api.init().then(() => setReady(true))
  }, [api])

  return ready ? (
    <>
      <centerGraphContext.Provider value={{ api }}>
        <AuthProvider {...oidcConfig}>
          <AuthHandler>
            <Suspense>{children}</Suspense>
          </AuthHandler>
        </AuthProvider>
      </centerGraphContext.Provider>
    </>
  ) : null
}
