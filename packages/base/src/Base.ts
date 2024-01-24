import * as namespaces from '@centergraph/shared/lib/namespaces.ts'
import { DenoFolderAdapter } from '@centergraph/turtle-sync/src/adapters/DenoFolderAdapter.ts'
import turtleSync from '@centergraph/turtle-sync/src/turtleSync.ts'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { Express, Request, Response } from 'express'
import fs from 'fs'
import { Store } from 'n3'

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
const namespacesAsPrefixes = Object.fromEntries(
  Object.entries(namespaces).map(([prefix, builder]: [string, () => { value: string }]) => [prefix, builder().value])
)
export const context = JSON.parse(fs.readFileSync(`${folder}/context.json`, 'utf-8'))
export const jwks = JSON.parse(fs.readFileSync(`${folder}/jwks.json`, 'utf-8'))
Object.assign(context, prefixes, namespacesAsPrefixes)
const oidc = createProvider(baseIRI)

const app: Express = express()
app.use(cors())
app.get('/api/query', query)
app.get('/api/context', contextRoute)
app.get('/api/types', types)
app.use('/oidc', oidc.callback())
app.use(bodyParser.text({ type: '*/*' }), turtle)
app.use(
  express.static(folder, {
    extensions: ['svg'],
  })
)
app.get('/', (_request: Request, response: Response) => {
  response.send('Hello, welcome to CenterGraph')
})

app.listen(port, () => {
  console.log(`Ready: CenterGraph Base is running on ${baseIRI}/`)
})

const watcher = fs.watch(folder, { recursive: true }, (event, filename) => {
  console.log(`Detected ${event} in ${filename}`)
})

// for await (const event of watcher) {
//   if (event.kind === 'modify') {
//     Deno.run({ cmd: ['touch', new URL('', import.meta.url).pathname] })
//   }
// }
