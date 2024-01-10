import useSWR from 'swr'

export const useApi = <T extends { url: string } & PromiseLike<Awaited<T>>>(input: T): [Awaited<T> | undefined, Error, boolean] => {
  const { data, error, isLoading } = useSWR(input.url, () => Promise.resolve(input), {
    suspense: true,
    fallbackData: [],
  })
  return [data, error, isLoading]
}
