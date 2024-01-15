import { signal, Signal } from '@preact-signals/safe-react'

const resourceCache = new Map()
const signals: Map<string, Signal> = new Map()

export function asResource<T>(promise: PromiseLike<T>, cacheKey: string, subscribeCallback?: () => void) {
  if (resourceCache.has(cacheKey)) return resourceCache.get(cacheKey).read()

  let status = 'pending'
  let response: T

  const suspender = promise.then(
    (res) => {
      status = 'success'

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
    }
  }
}

export const setResource = <T>(promise: PromiseLike<T>, cacheKey: string) => {
  clearCache(cacheKey)
  return promise.then((result) => {
    signals.get(cacheKey)!.value = result
    resourceCache.delete(cacheKey)
  })
}
