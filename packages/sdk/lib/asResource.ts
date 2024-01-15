import { signal, Signal } from '@preact-signals/safe-react'
import { simpleCache } from './CenterGraph'

const resourceCache = new Map()
const signals: Map<string, Signal> = new Map()
const cacheIds: Map<string, string[]> = new Map()
const promises: Map<string, PromiseLike<unknown>> = new Map()

export function asResource<T>(promise: PromiseLike<T>, cacheKey: string, subscribeCallback?: () => void) {
  if (resourceCache.has(cacheKey)) return resourceCache.get(cacheKey).read()

  let status = 'pending'
  let response: T

  promises.set(cacheKey, promise)

  const suspender = promise.then(
    (res) => {
      status = 'success'

      if (Array.isArray(res) && res?.[0]?.value) {
        const namedNodes = res.map((item) => item?.value).filter(Boolean)
        cacheIds.set(cacheKey, namedNodes)
      }

      if (!signals.has(cacheKey)) {
        signals.set(cacheKey, signal(res))
      } else {
        signals.get(cacheKey)!.value = res
      }

      const resourceSignal = signals.get(cacheKey)!

      if (subscribeCallback) resourceSignal.subscribe(subscribeCallback)

      response = resourceSignal.value
    },
    (err) => {
      status = 'error'
      response = err
    }
  )

  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }

  const resource = { read }
  resourceCache.set(cacheKey, resource)
  return resourceCache.get(cacheKey).read()
}

export const clearCache = (contains?: string) => {
  for (const key of resourceCache.keys()) {
    if (key?.includes(contains)) {
      resourceCache.delete(key)
      cacheIds.delete(key)
    }
  }
}

export const deleteResource = async (cacheKey: string) => {
  clearCache(cacheKey)

  for (const [key, values] of cacheIds.entries()) {
    if (values.includes(cacheKey)) {
      delete simpleCache._simplyCachedRequests[`GET${key}`]
      resourceCache.delete(key)
      const promise = promises.get(key)!
      await updateResource(promise, key)
    }
  }

  signals.delete(cacheKey)
  cacheIds.delete(cacheKey)
  resourceCache.delete(cacheKey)
}

export const updateResource = <T>(promise: PromiseLike<T>, cacheKey: string) => {
  clearCache(cacheKey)
  return promise.then((result) => {
    signals.get(cacheKey)!.value = result
    cacheIds.delete(cacheKey)
    resourceCache.delete(cacheKey)
  })
}
