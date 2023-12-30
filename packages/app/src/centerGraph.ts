import { CenterGraph } from '@centergraph/sdk'
import '@centergraph/sdk/dist/style.css'

export const api = new CenterGraph({
  base: 'http://localhost:8000',
})

await api.populateStore()
