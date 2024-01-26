import { ResourceableQueryBuilder } from '@centergraph/sdk/requests/ResourceableQueryBuilder'
import { NamedNode } from '@rdfjs/types'
import { ReactNode, useContext } from 'react'
import View from './View'
import { centerGraphContext } from '../context'
import { Suspense, useEffect, useState } from 'react'

type ListProps<T> = {
  as: string
  children?: ReactNode
  query: ResourceableQueryBuilder<NamedNode<string>[]>
}

export default function List<T>({ as, query }: ListProps<T>) {
  const { api } = useContext(centerGraphContext)
  const [iris, setIris] = useState<NamedNode<string>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true)
      query.then((iris) => {
        setIris(iris)
        setIsLoading(false)
      })
    }
  }, [query, isLoading])

  return (
    <Suspense>
      {iris.map((iri) => (
        <View data={api.get(iri)} as={as} />
      ))}
    </Suspense>
  )
}
