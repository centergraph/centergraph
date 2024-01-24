import { Suspense, ReactNode, useEffect, useState } from 'react'
import { centerGraphContext } from '.'
import { CenterGraph } from '../../CenterGraph'
import { AuthProvider } from 'react-oidc-context'

type ContextProviderProps = {
  api: CenterGraph
  children: ReactNode
}

const oidcConfig = {
  authority: 'http://localhost:8000/oidc/',
  client_id: 'centergraph',
  redirect_uri: 'http://localhost:8001/redirect',
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
          <Suspense>{children}</Suspense>
        </AuthProvider>
      </centerGraphContext.Provider>
    </>
  ) : null
}
