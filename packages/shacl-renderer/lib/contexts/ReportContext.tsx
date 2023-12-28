import { createContext } from 'react'

export const reportContext = createContext<{ validate: () => void; report: any }>({ validate: () => null, report: null })
