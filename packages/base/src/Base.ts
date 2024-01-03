import * as namespaces from '@centergraph/shared/lib/namespaces.ts'
import cors from 'cors'
import express from 'express'
import { Store } from 'n3'
import { Express, Request, Response } from 'types-express'

import { DenoFolderAdapter } from '../../turtle-sync/src/adapters/DenoFolderAdapter.ts'
import turtleSync from '../../turtle-sync/src/turtleSync.ts'
import { context as contextRoute } from './routes/context.ts'
import { createProvider } from './routes/oidc.ts'
import { query } from './routes/query.ts'
import { turtle } from './routes/turtle.ts'
import { types } from './routes/types.ts'

export const folder = '../../data/address-book'
export const store = new Store()
export const baseIRI = 'http://localhost:8000'
export const { prefixes } = await turtleSync({
  store,
  baseIRI: baseIRI + '/',
  folderAdapter: new DenoFolderAdapter(folder),
})

const port = 8000
const namespacesAsPrefixes = Object.fromEntries(Object.entries(namespaces).map(([prefix, builder]) => [prefix, builder().value]))
export const context = JSON.parse(Deno.readTextFileSync(`${folder}/context.json`))
export const jwks = JSON.parse(Deno.readTextFileSync(`${folder}/jwks.json`))
Object.assign(context, prefixes, namespacesAsPrefixes)
const oidc = createProvider(baseIRI)

const app: Express = express()
app.use(cors())
app.get('/api/query', query)
app.get('/api/context', contextRoute)
app.get('/api/types', types)
app.use('/oidc', oidc.callback())
app.use(turtle)
app.get('/', (_request: Request, response: Response) => {
  response.send('Hello, welcome to CenterGraph')
})

app.listen(port, () => {
  console.log(`CenterGraph Base is running on ${baseIRI}`)
})
