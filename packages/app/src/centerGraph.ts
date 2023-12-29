import { CenterGraph } from '@centergraph/sdk'

export const centerGraph = new CenterGraph({
  base: 'http://localhost:8080',
})

await centerGraph.populateStore()
