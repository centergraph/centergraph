import { ReactNode, Suspense } from 'react'
import React from 'react'
import { centerGraphContext } from './index'
import { CenterGraph } from '../../CenterGraph'
import useSWR from 'swr'

type ContextProviderProps = {
  api: CenterGraph
  children: ReactNode
}

export default function CenterGraphContextProvider({ children, api }: ContextProviderProps) {
  const { data } = useSWR('populateStore', () => api.populateStore(), {
    suspense: true,
    fallbackData: true,
  })

  return (
    <Suspense>
      {data ? (
        <>
          <centerGraphContext.Provider
            value={{
              api,
            }}
          >
            {children}
          </centerGraphContext.Provider>
        </>
      ) : (
        'Loading...'
      )}
    </Suspense>
  )
}
