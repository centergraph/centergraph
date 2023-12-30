import { createElement } from 'react'
import View from './components/View'

export class GetRequest {
  #url: string
  #fetch: (typeof globalThis)['fetch']

  constructor(url: string, fetch?: (typeof globalThis)['fetch']) {
    this.#url = url
    this.#fetch = fetch ?? globalThis.fetch
  }

  then<TResult = string, TRejection = never>(
    onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
    onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
  ): PromiseLike<TResult | TRejection> {
    return this.#fetch(this.#url)
      .then((response) => response.text())
      .then(onfulfilled, onrejected)
  }

  as(viewMode: string) {
    const promise = this as unknown as Promise<string>

    return createElement(View, {
      viewMode,
      url: this.#url,
      promise,
      key: this.#url,
      fetch: this.#fetch,
    })
  }
}
