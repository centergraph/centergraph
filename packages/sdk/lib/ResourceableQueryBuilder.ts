import { QueryBuilder } from '@centergraph/shared/lib/QueryBuilder'
import { NamedNode } from '@rdfjs/types'
import { LRUCache } from 'typescript-lru-cache'
import { asResource } from './asResource'

const resourceCache = new LRUCache()

export class ResourceableQueryBuilder<T extends NamedNode[] | number> extends QueryBuilder<T> {
  asResource(): T {
    if (resourceCache.has(this.url)) return resourceCache.get(this.url).read()

    const promise = this.then()
    const resource = asResource(promise)
    resourceCache.set(this.url, resource)

    return resource.read()
  }
}
