import { Context } from 'oak'

const inMemoryCache: Map<string, Set<string>> = new Map()

export const cache = () => async (context: Context, next: () => Promise<unknown>) => {
  if (context.request.method !== 'GET') {
    await next()
    return
  }

  const givenEtag = context.request.headers.get('If-None-Match')
  const url = context.request.url.toString()
  const etags = inMemoryCache.get(url)

  if (givenEtag && etags?.size) {
    let match = false
    for (const etag of etags) {
      if (givenEtag.includes(etag)) {
        match = true
        break
      }
    }

    if (match) {
      context.response.status = 304
      context.response.body = null
      return
    }
  }

  await next()
}

export const saveCache = async (context: Context, next: () => Promise<unknown>) => {
  await next()

  if (context.request.method !== 'GET') return

  const calculatedEtag = context.response.headers.get('etag')
  if (calculatedEtag) {
    const url = context.request.url.toString()
    if (!inMemoryCache.has(url)) inMemoryCache.set(url, new Set())
    const previousEtags = inMemoryCache.get(url)
    previousEtags?.add(calculatedEtag)
  }
}
