import { useEffect, useState } from 'react'

export const useApi = <T extends PromiseLike<Awaited<T>>>(input: T) => {
  const [result, setResult] = useState<Awaited<T>>()

  useEffect(() => {
    input.then(setResult)
  }, [input])

  return result
}
