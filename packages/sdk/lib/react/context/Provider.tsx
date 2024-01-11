import { ReactNode, useEffect, useState } from 'react'
import { centerGraphContext } from '.'
import { CenterGraph } from '../../CenterGraph'

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
      <centerGraphContext.Provider
        value={{
          api,
        }}
      >
        {children}
      </centerGraphContext.Provider>
    </>
  ) : null
}
