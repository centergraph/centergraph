import dataFactory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { QueryBuilder } from '@shared/QueryBuilder.ts'
import { Request, Response } from 'express'

import { baseIRI, store } from '../Base.ts'

export const query = async (request: Request, response: Response) => {
  const queryBuilder = new QueryBuilder({
    base: baseIRI,
    store,
    mode: 'local',
  })

  const parsedUrl = new URL(baseIRI + request.url)

  const rawUrlQuery = parsedUrl.searchParams.get('query')
  if (!rawUrlQuery) throw new Error('Missing query')

  const urlQuery = JSON.parse(rawUrlQuery) as {
    filters: { predicate: Term; object?: Term }[]
    sorters: { predicate: Term; order: 'ascending' | 'descending' }[]
    paginate: { limit?: number; offset?: number }
  }

  if (urlQuery.filters) {
    for (const { predicate, object } of urlQuery.filters) {
      queryBuilder.filter(dataFactory.fromTerm(predicate), object ? dataFactory.fromTerm(object) : undefined)
    }

    for (const { predicate, order } of urlQuery.sorters) {
      queryBuilder.sort(dataFactory.fromTerm(predicate), order)
    }

    queryBuilder.paginate(urlQuery.paginate.limit, urlQuery.paginate.offset)
  }

  const graphs = await queryBuilder

  try {
    response.send(graphs.map((graph) => graph.value))
  } catch (error) {
    response.send(error.message)
  }
}
