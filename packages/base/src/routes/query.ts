import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder.ts'
import dataFactory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import { Request, Response } from 'express'
import { JsonLdContextNormalized } from 'jsonld-context-parser'

import { baseIRI, context, store } from '../Base.ts'

export const query = async (request: Request, response: Response) => {
  const parsedUrl = new URL(baseIRI + request.url)
  const jsonLdContext = new JsonLdContextNormalized(context)

  const unflatten = (flattenedTerm: string) => {
    if (flattenedTerm.startsWith('"') && flattenedTerm.endsWith('"')) {
      return dataFactory.literal(flattenedTerm.substring(1, flattenedTerm.length - 1))
    }

    if (flattenedTerm.startsWith('"') && flattenedTerm.includes('^^')) {
      throw new Error('Implement data literal')
    }

    const expandedTerm = jsonLdContext.expandTerm(flattenedTerm, true)
    return dataFactory.namedNode(expandedTerm)
  }

  const asCount = parsedUrl.searchParams.get('asCount') ? JSON.parse(parsedUrl.searchParams.get('asCount')!) : false

  // TODO integrate a SPARQL way
  const queryBuilder = new QueryBuilder({
    base: baseIRI,
    store,
    mode: 'local',
    asCount: !!asCount,
  })

  const filters = parsedUrl.searchParams.get('filters') ? JSON.parse(parsedUrl.searchParams.get('filters')!) : undefined
  if (filters) {
    for (const [predicate, object] of filters) {
      const expandedPredicate = unflatten(predicate)
      queryBuilder.filter(expandedPredicate, object ? unflatten(object) : undefined)
    }
  }

  const sorters = parsedUrl.searchParams.get('sorters') ? JSON.parse(parsedUrl.searchParams.get('sorters')!) : undefined
  if (sorters) {
    for (const [predicate, order] of sorters) {
      queryBuilder.sort(unflatten(predicate), order ?? 'ASC')
    }
  }

  const paginate = parsedUrl.searchParams.get('paginate')
    ? JSON.parse(parsedUrl.searchParams.get('paginate')!)
    : undefined
  if (paginate) queryBuilder.paginate(paginate.limit, paginate.offset)

  const result = await queryBuilder

  try {
    response.send(asCount ? { result } : (result as NamedNode[]).map((graph) => graph.value))
  } catch (error) {
    response.send(error.message)
  }
}
