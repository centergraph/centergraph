import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder.ts'
import dataFactory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Request, Response } from 'express'

import { baseIRI, store } from '../Base.ts'

export const query = async (request: Request, response: Response) => {
  const parsedUrl = new URL(baseIRI + request.url)

  const rawUrlQuery = parsedUrl.searchParams.get('query')
  if (!rawUrlQuery) throw new Error('Missing query')

  const urlQuery = JSON.parse(rawUrlQuery) as {
    filters: { predicate: Term; object?: Term }[]
    sorters: { predicate: Term; order: 'ascending' | 'descending' }[]
    paginate: { limit?: number; offset?: number }
    asCount?: boolean
  }

  const queryBuilder = new QueryBuilder({
    base: baseIRI,
    // TODO integrate a SPARQL way
    store,
    mode: 'local',
    asCount: !!urlQuery.asCount,
  })

  if (urlQuery.filters) {
    for (const { predicate, object } of urlQuery.filters) {
      queryBuilder.filter(dataFactory.fromTerm(predicate), object ? dataFactory.fromTerm(object) : undefined)
    }
  }

  if (urlQuery.sorters) {
    for (const { predicate, order } of urlQuery.sorters) {
      queryBuilder.sort(dataFactory.fromTerm(predicate), order)
    }
  }

  if (urlQuery.paginate) queryBuilder.paginate(urlQuery.paginate.limit, urlQuery.paginate.offset)

  const result = await queryBuilder

  try {
    response.send(urlQuery.asCount ? { result } : result.map((graph) => graph.value))
  } catch (error) {
    response.send(error.message)
  }
}
