export abstract class AbstractApiRequest<T = Response> implements PromiseLike<T> {
  constructor(protected fetch: (typeof globalThis)['fetch']) {}

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.handleFetch().then(onfulfilled, onrejected)
  }

  protected abstract fetchArguments(): {
    input: string | URL | globalThis.Request
    init?: RequestInit
  }

  protected abstract handleFetch(): Promise<T>

  protected get cacheId() {
    const action = this.fetchArguments()
    return JSON.stringify(action)
  }
}
