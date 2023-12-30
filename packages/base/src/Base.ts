import cors from 'cors'
import express from 'express'
import { Store } from 'n3'
import { Express } from 'types-express'

import { DenoFolderAdapter } from '../../turtle-sync/src/adapters/DenoFolderAdapter.ts'
import turtleSync from '../../turtle-sync/src/turtleSync.ts'
import { query } from './routes/query.ts'
import { turtle } from './routes/turtle.ts'

const app: Express = express()
app.use(cors())
app.get('/api/query', query)
app.use(turtle)

export const store = new Store()
export const baseIRI = 'http://localhost:8080'
export const { prefixes } = await turtleSync({
  store,
  baseIRI: baseIRI + '/',
  folderAdapter: new DenoFolderAdapter('../../data/address-book'),
})

const port = 8080
app.listen(port, () => {
  console.log(`CenterGraph Base is running on http://localhost:${port}`)
})
