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
      <centerGraphContext.Provider value={{ api }}>
        <SuspenseRouter window={window}>
          <Suspense fallback={'Loading...'}>{children}</Suspense>
        </SuspenseRouter>
      </centerGraphContext.Provider>
    </>
  ) : null
}
