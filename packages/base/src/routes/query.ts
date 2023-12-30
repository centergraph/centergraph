import { QueryBuilder } from '@shared/QueryBuilder.ts'
import { DataFactory } from 'n3'
import { RouterContext } from 'oak'

import { baseIRI, store } from '../Base.ts'

const toTerm = (input: string) => {
  if (input.startsWith('https://') || input.startsWith('http://')) {
    return DataFactory.namedNode(input)
  }
  return DataFactory.literal(input)
}

export const query = async (context: RouterContext<'/api/query'>) => {
  const queryBuilder = new QueryBuilder({
    base: baseIRI,
    store,
    mode: 'local',
  })

  const rawUrlQuery = context.request.url.searchParams.get('query')
  if (!rawUrlQuery) throw new Error('Missing query')

  const urlQuery = JSON.parse(rawUrlQuery) as {
    filters: { predicate: string; object?: string }[]
    sorters: { predicate: string; order: 'ascending' | 'descending' }[]
    paginate: { limit?: number; offset?: number }
  }

  if (urlQuery.filters) {
    for (const { predicate, object } of urlQuery.filters) {
      queryBuilder.filter(toTerm(predicate), object ? toTerm(object) : undefined)
    }

    for (const { predicate, order } of urlQuery.sorters) {
      queryBuilder.sort(toTerm(predicate), order)
    }

    queryBuilder.paginate(urlQuery.paginate.limit, urlQuery.paginate.offset)
  }

  const graphs = await queryBuilder

  try {
    context.response.body = graphs.map((graph) => graph.value)
  } catch (error) {
    context.response.body = error.message
  }
}
