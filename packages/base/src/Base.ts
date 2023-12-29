import { oakCors } from 'cors'
import { Store } from 'n3'
import { Application, etag, Router } from 'oak'

import { DenoFolderAdapter } from '../../turtle-sync/src/adapters/DenoFolderAdapter.ts'
import turtleSync from '../../turtle-sync/src/turtleSync.ts'
import { saveCache } from './middleware/cache.ts'
import { error } from './middleware/error.ts'
import { notFound } from './middleware/notFound.ts'
import { turtle } from './routes/turtle.ts'

const router = new Router()
export const store = new Store()

export const baseIRI = 'http://example.com'

export const { prefixes } = await turtleSync({
  store,
  baseIRI: baseIRI + '/',
  folderAdapter: new DenoFolderAdapter('../../data/address-book'),
})

const port = 8080

const controller = new AbortController()
export const shutdownServer = () => controller.abort()
const { signal } = controller

const app = new Application()

app.use(turtle, notFound, error, oakCors(), saveCache, etag.factory())
app.use(router.routes(), router.allowedMethods())

const listenPromise = app.listen({ port, signal })
console.log(`CenterGraph Base is running on http://localhost:${port}`)

listenPromise.then(() => {
  console.log('CenterGraph Base has closed')
})
