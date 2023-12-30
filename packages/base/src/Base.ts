import cors from 'cors'
import express from 'express'
import { Store } from 'n3'
import { Express } from 'types-express'

import { DenoFolderAdapter } from '../../turtle-sync/src/adapters/DenoFolderAdapter.ts'
import turtleSync from '../../turtle-sync/src/turtleSync.ts'
import { context } from './routes/context.ts'
import { query } from './routes/query.ts'
import { turtle } from './routes/turtle.ts'

const app: Express = express()
app.use(cors())
app.get('/api/query', query)
app.get('/api/context', context)

app.use(turtle)

export const store = new Store()
export const baseIRI = 'http://localhost:8000'
export const { prefixes } = await turtleSync({
  store,
  baseIRI: baseIRI + '/',
  folderAdapter: new DenoFolderAdapter('../../data/address-book'),
})

const port = 8000
app.listen(port, () => {
  console.log(`CenterGraph Base is running on http://localhost:${port}`)
})
