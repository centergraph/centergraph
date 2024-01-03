import { createContext } from 'react'
import { CenterGraph } from '../../CenterGraph'

export type CenterGraphContext = {
  api: CenterGraph
}

export const centerGraphContext = createContext<CenterGraphContext>({} as CenterGraphContext)
