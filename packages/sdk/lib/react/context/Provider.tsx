import { Suspense, ReactNode, useEffect, useState } from 'react'
import { centerGraphContext } from '.'
import { CenterGraph } from '../../CenterGraph'
import SuspenseRouter from '../components/SuspenseRouter'

type ContextProviderProps = {
  api: CenterGraph
  children: ReactNode
}

export default function CenterGraphContextProvider({ children, api }: ContextProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api.populateStore().then(() => setReady(true))
  }, [api])

  return ready ? (
    <>
      <Suspense fallback={'Loading...'}>
        <centerGraphContext.Provider value={{ api }}>
          <SuspenseRouter window={window}>{children}</SuspenseRouter>
        </centerGraphContext.Provider>
      </Suspense>
    </>
  ) : null
}
