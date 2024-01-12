import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder'
import { NamedNode } from '@rdfjs/types'
import { cachedAsResource } from './asResource'

export class ResourceableQueryBuilder<T extends NamedNode[] | number> extends QueryBuilder<T> {
  /**
   * The resource is eager, meaning you should not use this directly in the root of a React component
   * if you do not want to trigger resolving of the Promise.
   */
  asResource(): T {
    const promise = this.then()
    return cachedAsResource(promise, this.url)
  }
}
