const resourceCache = new Map()

export function asResource<T>(promise: PromiseLike<T>) {
  let status = 'pending'
  let response: T

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
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

  return { read }
}

export function cachedAsResource<T>(promise: PromiseLike<T>, cacheKey: string) {
  if (resourceCache.has(cacheKey)) return resourceCache.get(cacheKey).read()
  const resource = asResource(promise)
  resourceCache.set(cacheKey, resource)
  return resource.read()
}
